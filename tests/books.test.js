const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'The Davinci Code',
          author: 'Dan Brown',
          genre: 'Crime',
          ISBN: '245215',
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('The Davinci Code');
        expect(newBookRecord.title).to.equal('The Davinci Code');
        expect(newBookRecord.author).to.equal('Dan Brown');
        expect(newBookRecord.genre).to.equal('Crime');
        expect(newBookRecord.ISBN).to.equal('245215');
      });
    });
  });

  describe('with no posts in the database', () => {
    describe('POST /books', () => {
      it('returns 400 with no author', async () => {
        const response = await request(app).post('/books').send({
          title: 'Mr Nice',
          ISBN: '123456',
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(
          'notNull Violation: Please enter an author'
        );
      });
      it('returns 400 with no title', async () => {
        const response = await request(app).post('/books').send({
          author: 'Howard Marks',
          ISBN: '123456',
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(
          'notNull Violation: Please enter a title'
        );
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: 'The Davinci Code',
          author: 'Dan Brown',
          genre: 'Crime',
          ISBN: '245215',
        }),
        Book.create({
          title: '1984',
          author: 'George Orwell',
          genre: 'SciFi',
          ISBN: '245211',
        }),
        ,
        Book.create({
          title: 'Brave New World',
          author: 'Aldou Huxley',
          genre: 'SciFi',
          ISBN: '245238',
        }),
      ]);
    });

    describe('GET /books/:id', () => {
      it('gets books record by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates readers email by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ genre: 'fantasy' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.genre).to.equal('fantasy');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/12345')
          .send({ genre: 'fantasy' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('This book could not be found');
      });
    });
  });
});
