const path = require('path');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'bookstoreDB';
const COLLECTION_NAME = 'books';
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

const client = new MongoClient(MONGO_URI);
let books;

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

function createBookPayload(body) {
  return {
    title: body.title,
    author: body.author,
    price: Number(body.price),
    genre: body.genre
  };
}

app.get('/api/books', async (req, res) => {
  const bookList = await books.find().sort({ title: 1 }).toArray();
  res.json(bookList);
});

app.get('/api/books/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }

  const book = await books.findOne({ _id: new ObjectId(req.params.id) });
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json(book);
});

app.post('/api/books', async (req, res) => {
  const result = await books.insertOne(createBookPayload(req.body));
  res.status(201).json({ insertedId: result.insertedId });
});

app.put('/api/books/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }

  const result = await books.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: createBookPayload(req.body) }
  );

  if (!result.matchedCount) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json({ message: 'Book updated' });
});

app.delete('/api/books/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid book id' });
  }

  const result = await books.deleteOne({ _id: new ObjectId(req.params.id) });
  if (!result.deletedCount) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json({ message: 'Book deleted' });
});

async function startServer() {
  await client.connect();
  const db = client.db(DB_NAME);
  books = db.collection(COLLECTION_NAME);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Frontend served from: ${PUBLIC_DIR}`);
    console.log(`Connected to database: ${DB_NAME}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
