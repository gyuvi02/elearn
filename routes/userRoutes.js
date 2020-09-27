const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const ebookRouter = require('./ebookRoutes');

router.use('/ebooks', ebookRouter); //this means that this specific route will be handled by ebookRoutes
																				//it calls the root of ebookRoutes, and it is OK for us, the GET there leads to getAllEbooks,
																				//and that is what we want. If I add authController.protect to that GET, we do not need
																				//to add a user id, the logged in users' ebooks will be displayed

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
    .delete(authController.protect, authController.restrictTo('admin'), userController.deleteUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// router.route('/:id/ebooks').get(authController.protect, ebookController.getAllEbooks);


module.exports = router;
