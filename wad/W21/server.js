const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'bookstoreDB';
const COLLECTION_NAME = 'books';

app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(MONGO_URI);
let books;

function pageTemplate(title, content) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 20px;
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      color: #111;
    }

    .container {
      max-width: 1000px;
      margin: auto;
      padding: 18px;
      background: white;
      border: 1px solid #ccc;
    }

    h1, h2 {
      margin-top: 0;
    }

    form {
      margin-bottom: 18px;
      padding: 12px;
      border: 1px solid #ccc;
      background: #fafafa;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      margin-bottom: 10px;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #999;
      box-sizing: border-box;
    }

    button, a {
      display: inline-block;
      padding: 8px 12px;
      border: 1px solid #333;
      background: #eee;
      color: #111;
      text-decoration: none;
      cursor: pointer;
      font-size: 14px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      background: white;
    }

    th, td {
      border: 2px solid #111;
      padding: 9px;
      text-align: left;
    }

    th {
      background: #eee;
    }

    .actions {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>`;
}

function bookForm(action, book = {}) {
  return `
    <form method="post" action="${action}">
      <h2>${book._id ? 'Update Book' : 'Add Book'}</h2>
      <div class="form-row">
        <input type="text" name="title" placeholder="Title" value="${book.title || ''}" required>
        <input type="text" name="author" placeholder="Author" value="${book.author || ''}" required>
        <input type="number" name="price" placeholder="Price" value="${book.price || ''}" required>
        <input type="text" name="genre" placeholder="Genre" value="${book.genre || ''}" required>
      </div>
      <button type="submit">${book._id ? 'Update Book' : 'Add Book'}</button>
      ${book._id ? '<a href="/">Cancel</a>' : ''}
    </form>
  `;
}

function bookTable(bookList) {
  const rows = bookList.map((book) => `
    <tr>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.price}</td>
      <td>${book.genre}</td>
      <td>
        <div class="actions">
          <a href="/edit/${book._id}">Edit</a>
          <form method="post" action="/delete/${book._id}" style="margin:0; padding:0; border:0; background:transparent;">
            <button type="submit">Delete</button>
          </form>
        </div>
      </td>
    </tr>
  `).join('');

  return `
    <h2>Book Records</h2>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Price</th>
          <th>Genre</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="5">No book records found</td></tr>'}
      </tbody>
    </table>
  `;
}

async function renderHome(res, editBook = null) {
  const bookList = await books.find().sort({ title: 1 }).toArray();
  const form = editBook ? bookForm(`/update/${editBook._id}`, editBook) : bookForm('/add');

  res.send(pageTemplate('Bookstore Management', `
    <h1>Online Bookstore</h1>
    ${form}
    ${bookTable(bookList)}
  `));
}

app.get('/', async (req, res) => {
  await renderHome(res);
});

app.post('/add', async (req, res) => {
  await books.insertOne({
    title: req.body.title,
    author: req.body.author,
    price: Number(req.body.price),
    genre: req.body.genre
  });

  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const book = await books.findOne({ _id: new ObjectId(req.params.id) });
  await renderHome(res, book);
});

app.post('/update/:id', async (req, res) => {
  await books.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        price: Number(req.body.price),
        genre: req.body.genre
      }
    }
  );

  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await books.deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect('/');
});

async function startServer() {
  await client.connect();
  const db = client.db(DB_NAME);
  books = db.collection(COLLECTION_NAME);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Connected to database: ${DB_NAME}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
