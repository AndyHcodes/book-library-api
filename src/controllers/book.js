const { Book } = require('../models');
const { createItem } = require('./helpers');

const getBooks = (_, res) => {
  Book.findAll().then((books) => {
    res.status(200).json(books);
  });
};

const createBook = (req, res) => createItem(res, 'book', req.body);

const updateBook = (req, res) => {
  const { id } = req.params;
  const newDetails = req.body;

  Book.update(newDetails, { where: { id } }).then(([bookUpdated]) => {
    if (!bookUpdated) {
      res.status(404).json({ error: 'The book could not be found.' });
    } else {
      Book.findByPk(id).then((updatedBook) => {
        res.status(200).json(updatedBook);
      });
    }
  });
};

const getBookById = (req, res) => {
  const { id } = req.params;

  Book.findByPk(id).then((book) => {
    if (!book) {
      res.status(404).json({ error: 'The book could not be found' });
    } else {
      res.status(200).json(book);
    }
  });
};

const deleteBook = (req, res) => {
  const { id } = req.params;

  Book.findByPk(id).then((foundBook) => {
    if (!foundBook) {
      res.status(404).json({ error: 'This book could not be found' });
    } else {
      Book.destroy({ where: { id } }).then(() => {
        res.status(204).send();
      });
    }
  });
};

module.exports = {
  createBook,
  getBooks,
  updateBook,
  getBookById,
  deleteBook,
};
