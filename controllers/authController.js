const User = require('../models/UserModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const signToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    userName: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please enter your username or password', 400));
  }
  const user = await User.findOne({ where: { userName: username } });
  if (!user) {
    return next(new AppError('No user found with that username', 404));
  }
  const verify = await user.authenticate(password);
  if (!verify) {
    return next(new AppError('Incorrect username or password', 403));
  }
  createAndSendToken(user, 200, res);
});

exports.authenticate = catchAsync(async (req, res, next) => {
  let token; //initialize token variable
  //get token from the req
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //if no token in req deny access
  if (!token) {
    return next(
      new AppError('You are not logged in, please log in to gain access', 401)
    );
  }
  //validate token
  const decodedToken = await promisify(JWT.verify)(
    token,
    process.env.JWT_SECRET
  );
  //check if user associated with token still exists
  const user = await User.findOne({ where: { id: decodedToken.id } });
  if (!user) {
    return next(
      new AppError('The user associated with this token no longer exists', 401)
    );
  }
  //place current user on the req obj and grant access
  req.user = user;
  next();
});
/**
 * 
 * 
 restrict To function( RESTRICTS ACCESS TO SPECIFIC ROUTES TO SPECIFIC ROLES)
 accepts an array of user roles (Strings)
 @param  {...any} roles 
 if user.role is not included in the roles array passed in access is denied
 else access granted
 can only be used after the authenticate function
 * 
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the authorization to perform this action',
          403
        )
      );
    }
    next();
  };
};
