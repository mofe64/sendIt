const Sequelize = require('sequelize');
const db = require('../Database');
const uuid = require('uuid');
const { UUIDV4 } = require('sequelize');
const bcrypt = require('bcryptjs');
const Parcel = require('./ParcelModel');

const User = db.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4(),
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'Username already taken please enter another',
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'This email is already registered, please use another',
    },
    validate: {
      isEmail: {
        msg: 'Please enter a valid email',
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  passwordConfirm: {
    type: Sequelize.STRING,
    validate: {
      passwordMatch(passwordConfirm) {
        if (passwordConfirm !== this.password) {
          throw new Error('Passwords do not match');
        }
      },
    },
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'user',
  },
});

//User.beforeCreate((user) => (user.id = UUIDV4()));

//beforeCreate Hook to hash password
User.beforeCreate(async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    user.passwordConfirm = undefined;
  } catch (error) {
    console.log(error);
  }
});

//instance methos to verify password
User.prototype.authenticate = async function (givenpassword) {
  return await bcrypt.compare(givenpassword, this.password);
};

User.hasMany(Parcel);
Parcel.belongsTo(User);

module.exports = User;
