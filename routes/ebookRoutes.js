const express = require('express');
const router = express.Router({mergeParams: true});
const ebookController = require('./../controllers/ebookController');
const authController = require('./../controllers/authController');

// router.param('id', ebookController.checkID); //we could check the ID of the ebooks
router.route('/:id').get(ebookController.getEbook);

router.use(authController.protect);

router.route('/')
    .get(ebookController.getUserEbooks) //sends back all the ebooks of the logged in user
    .post(authController.restrictTo('teacher', 'admin'), ebookController.createEbook);

router.use(authController.restrictTo('admin', 'teacher'));

router.route('/:id')
    .patch(ebookController.updateEbook)
    .delete(ebookController.deleteEbook);

module.exports = router;
