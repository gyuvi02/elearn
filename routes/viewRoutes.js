const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.get('/', (req, res) => {
// 	res.status(200).render('index', {
// 		ebook: 'Radiology',
// 		user: 'Gyula'
// 	});
// });

router.get('/',authController.isLoggedIn, viewsController.getOverview);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/forgotPassword', viewsController.forgotPassword);


router.get('/my-ebooks',authController.protect, viewsController.getMyEbooks);
router.get('/my-ebooks/:id', authController.protect, viewsController.getOneEbook);
router.get('/me', authController.protect, viewsController.getAccount);


module.exports = router;
