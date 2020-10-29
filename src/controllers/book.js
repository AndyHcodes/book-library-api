const { Book } = require('../models');

const createBook = (req, res) => {
  const newBook = req.body;

  Book.create(newBook)
    .then((newBookCreated) => res.status(201).json(newBookCreated))
    .catch((error) => {
      console.log(error);
      if (error.errors[0].type === 'notNull Violation') {
        res.status(400).json(error.message);
      } else {
        res.status(500).json(error.message);
      }
    });
};

const getBooks = (_, res) => {
  Book.findAll().then((books) => {
    res.status(200).json(books);
  });
};

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
