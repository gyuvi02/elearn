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
router.get('/ebooks/:id', viewsController.getEbook);
router.get('/login', viewsController.getLoginForm);


module.exports = router;
