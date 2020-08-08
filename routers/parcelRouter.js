const express = require('express');
const parcelController = require('../controllers/parcelController');
const authContoller = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(parcelController.getAllParcels)
  .post(authContoller.authenticate, parcelController.createParcel);

router
  .route('/:parcelId')
  .get(authContoller.authenticate, parcelController.getParcelById);

router
  .route('/:parcelId/cancel')
  .put(authContoller.authenticate, parcelController.cancelParcel);

router
  .route('/:parcelId/destination')
  .put(authContoller.authenticate, parcelController.changeParcelDestination);

router
  .route('/:parcelId/status')
  .put(
    authContoller.authenticate,
    authContoller.restrictTo('admin'),
    parcelController.changeParcelStatus
  );
router
  .route('/:parcelId/presentLocation')
  .put(
    authContoller.authenticate,
    authContoller.restrictTo('admin'),
    parcelController.changeParcelPresentLocation
  );
module.exports = router;
