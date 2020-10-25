const express = require('express');

const router = express.Router();
const bookController = require('../controllers/book');

router.route('/').get(bookController.getBooks).post(bookController.createBook);

router
  .route('/:id')
  .patch(bookController.updateBook)
  .get(bookController.getBookById)
  .delete(bookController.deleteBook);

module.exports = router;
