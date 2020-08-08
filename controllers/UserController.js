const User = require('../models/UserModel');
const Parcel = require('../models/ParcelModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllParcelsBelongingToUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const userParcels = await Parcel.findAll({
    where: {
      userId: userId,
    },
  });
  const user = await userParcels[0].getUser();
  const parcelOwner = {
    firstname: user.firstName,
    lastname: user.lastName,
    username: user.userName,
    email: user.email,
  };
  //console.log(user);
  res.status(200).json({
    status: 'success',
    no_of_parcels: userParcels.length,
    parcelOwner,
    userParcels,
  });
});
