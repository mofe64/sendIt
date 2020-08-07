const express = require('express');
const parcelController = require('../controllers/parcelController');
const router = express.Router();

router
  .route('/')
  .get(parcelController.getAllParcels)
  .post(parcelController.createParcel);

router.route('/:parcelId').get(parcelController.getParcelById);

router.route('/:parcelId/cancel').put(parcelController.cancelParcel);
module.exports = router;
