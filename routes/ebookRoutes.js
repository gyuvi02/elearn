const express = require('express');
const router = express.Router({mergeParams: true});
const ebookController = require('./../controllers/ebookController');
const authController = require('./../controllers/authController');


// router.param('id', ebookController.checkID); //we could check the ID of the ebooks

router.route('/')
    .get(authController.protect, ebookController.getUserEbooks) //sends back all the ebooks of the logged in user
    .post(authController.protect, authController.restrictTo('teacher', 'admin'), ebookController.createEbook);

router.route('/:id')
    .get(ebookController.getEbook)
    .patch(ebookController.updateEbook)
    .delete(authController.protect, authController.restrictTo('admin', 'teacher'), ebookController.deleteEbook);

module.exports = router;
