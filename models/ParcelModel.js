const Sequelize = require('sequelize');
const db = require('../Database');
const uuid = require('uuid');
const { UUIDV4 } = require('sequelize');

const Parcel = db.define('parcel', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  destination: {
    type: Sequelize.STRING,
  },
  presentLocation: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});

Parcel.beforeCreate((parcel) => (parcel.id = UUIDV4()));
module.exports = Parcel;
