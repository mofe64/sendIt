const Parcel = require('../models/ParcelModel');

exports.getAllParcels = async (req, res, next) => {
  const parcels = await Parcel.findAll();
  res.status(200).json({
    status: 'success',
    No_of_parcels: parcels.length,
    parcels,
  });
};

exports.getParcelById = async (req, res, next) => {
  try {
    const id = req.params.parcelId;
    const parcel = await Parcel.findByPk(id);
    //console.log(parcel);
    res.status(200).json({
      status: 'success',
      parcel,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      msg: 'No Parcel found with that ID',
      error: error,
    });
  }
};

exports.createParcel = async (req, res, next) => {
  try {
    const newParcel = await Parcel.create({
      destination: req.body.destination,
      presentLocation: req.body.presentLocation,
      status: 'pending',
    });
    res.status(201).json({
      status: 'success',
      newParcel,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error,
    });
    //console.log(error);
  }
};

exports.cancelParcel = async (req, res, next) => {
  try {
    const id = req.params.parcelId;
    const parcel = await Parcel.update(
      { status: 'cancelled' },
      { where: { id: id } }
    );
    const updatedParcel = await Parcel.findByPk(id);
    res.status(200).json({
      status: 'success',
      updatedParcel,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      msg: 'No Parcel found with that ID',
      error: error,
    });
  }
};
