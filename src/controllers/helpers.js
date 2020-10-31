const { Book, Reader } = require('../models');

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
  };

  return models[model];
};

const createItem = (res, model, item) => {
  const Model = getModel(model);
  console.log(item);
  return Model.create(item)
    .then((newItemCreated) => res.status(201).json(newItemCreated))
    .catch((error) => {
      if (error.errors[0].type === 'Validation error') {
        res.status(400).json(error.message);
      } else if (error.errors[0].type === 'notNull Violation') {
        res.status(400).json(error.message);
      } else {
        res.status(500).json(error.message);
      }
    });
};

module.exports = { createItem };
