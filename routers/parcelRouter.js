const express = require('express');
const parcelController = require('../controllers/parcelController');
const authContoller = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(authContoller.authenticate, parcelController.getAllParcels)
  .post(authContoller.authenticate, parcelController.createParcel);

router.route('/:parcelId').get(parcelController.getParcelById);

router
  .route('/:parcelId/cancel')
  .put(authContoller.authenticate, parcelController.cancelParcel);
module.exports = router;
