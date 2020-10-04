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
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updatemypassword', authController.updatePassword);
router.patch('/updateme', userController.updateMe);
router.get('/me', userController.getMe, userController.getUser);

router.route('/')
    .get(authController.restrictTo('admin', 'teacher'), userController.getAllUsers)
    .post(authController.restrictTo('admin', 'teacher'),userController.createUser);

router.route('/:id')
	.get(userController.getUser)
	.patch(authController.restrictTo('admin'), userController.updateUser)
	.delete(authController.restrictTo('admin'), userController.deleteUser);

router.route('/:id/:ebook') //the teachers id, could be /me? ebook technically means course
	.patch(authController.restrictTo('admin', 'teacher'), userController.addCourse) //we add new courses and students to the new courses

module.exports = router;
