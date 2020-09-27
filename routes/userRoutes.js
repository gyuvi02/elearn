const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


router.post('/signup', authController.signUp,);
router.post('/login', authController.login);
router.patch('/updatemypassword', authController.protect, authController.updatePassword);
router.patch('/updateme', authController.protect, userController.updateMe);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(authController.protect, authController.restrictTo('admin'), userController.updateUser)
    .delete(authController.protect,authController.restrictTo('admin'), userController.deleteUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


module.exports = router;
