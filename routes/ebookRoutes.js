const express = require('express');
const router = express.Router();
const ebookController = require('./../controllers/ebookController');
const authController = require('./../controllers/authController');

// router.param('id', ebookController.checkID); //we could check the ID of the ebooks

router.route('/')
    .get(authController.protect, ebookController.getAllEbooks)
    .post(ebookController.createEbook);

router.route('/:id')
    .get(ebookController.getEbook)
    .patch(ebookController.updateEbook)
    .delete(ebookController.deleteEbook);

module.exports = router;
