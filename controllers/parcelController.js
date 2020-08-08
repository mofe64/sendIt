const Parcel = require('../models/ParcelModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllParcels = catchAsync(async (req, res, next) => {
  const parcels = await Parcel.findAll();
  res.status(200).json({
    status: 'success',
    No_of_parcels: parcels.length,
    parcels,
  });
});

exports.getParcelById = catchAsync(async (req, res, next) => {
  const id = req.params.parcelId;
  const parcel = await Parcel.findByPk(id);
  //console.log(parcel);
  if (!parcel) {
    return next(new AppError('No Parcel found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    parcel,
  });
});

exports.createParcel = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const newParcel = await Parcel.create({
    destination: req.body.destination,
    presentLocation: req.body.presentLocation,
    status: 'pending',
    userId: userID,
  });
  res.status(201).json({
    status: 'success',
    newParcel,
  });
});

/**
 * ******************************* cancelParcel function ******************************
 * function to cancel a parcel delivery order
 * we want to restrict cancellation of orders to the person who created the parcel only (parcel owner)
 * first we get the currently logged in user's ID from the req.user (the authenticate function must be used before  this to enable this and also to protect this route)
 * second we get the parcelId from the req.params
 * then we get the parcel using findByPK()
 * if we dont find the parcel then the parcelID given was wrong, we then throw an error
 * we then compare the userID stored in the parcel record with the current logged in userID if they match then the parcel owner is the user currently logged in and we can allow access, if they do not match then we throw an error
 * we then update the parcel and set its status to cancelled
 * Note we add the returning property and set it to true so as to allow the update method return the currently updated record, without it, the method only retuns the number of affected rows (This field is only available on postgress DBs)
 * we add the plain: true property to ensure sequelize doesnt add unneccessary data to our result
 * we then access the result itself by choosing the second element in the results array and adding .dataValues
 */

exports.cancelParcel = catchAsync(async (req, res, next) => {
  const parcelOwnerId = req.user.id;
  const parcelid = req.params.parcelId;
  const parcelToCheck = await Parcel.findByPk(parcelid);
  if (!parcelToCheck) {
    return next(new AppError('No Parcel found with that ID', 404));
  }
  if (parcelToCheck.userId !== parcelOwnerId) {
    return next(
      new AppError(
        'Parcels can only be cancelled by thier makers, Please log in as the parcel owner to cancel this parcel ',
        401
      )
    );
  }
  const result = await Parcel.update(
    { status: 'cancelled' },
    { where: { id: parcelid }, returning: true, plain: true }
  );
  //console.log(result[1].dataValues);
  const parcel = result[1].dataValues;
  res.status(200).json({
    status: 'success',
    parcel,
  });
});
