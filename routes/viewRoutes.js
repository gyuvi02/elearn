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
router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/myEbooks',authController.protect, viewsController.getMyEbooks);
router.get('/myEbooks/:id', authController.protect, viewsController.getOneEbook);
router.get('/login', viewsController.getLoginForm);


module.exports = router;
