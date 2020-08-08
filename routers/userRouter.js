const express = require('express');
const userController = require('../controllers/UserController');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/:userId/parcels')
  .get(
    authController.authenticate,
    userController.getAllParcelsBelongingToUser
  );

module.exports = router;
