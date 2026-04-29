const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'music';
const COLLECTION_NAME = 'song_details';

app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(MONGO_URI);
let songs;

const initialSongs = [
  {
    Songname: 'Tum Hi Ho',
    Film: 'Aashiqui 2',
    Music_director: 'Mithoon',
    singer: 'Arijit Singh'
  },
  {
    Songname: 'Kal Ho Naa Ho',
    Film: 'Kal Ho Naa Ho',
    Music_director: 'Shankar-Ehsaan-Loy',
    singer: 'Sonu Nigam'
  },
  {
    Songname: 'Channa Mereya',
    Film: 'Ae Dil Hai Mushkil',
    Music_director: 'Pritam',
    singer: 'Arijit Singh'
  },
  {
    Songname: 'Tujh Mein Rab Dikhta Hai',
    Film: 'Rab Ne Bana Di Jodi',
    Music_director: 'Salim-Sulaiman',
    singer: 'Roop Kumar Rathod'
  },
  {
    Songname: 'Kesariya',
    Film: 'Brahmastra',
    Music_director: 'Pritam',
    singer: 'Arijit Singh'
  }
];

function pageTemplate(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; background: #f5f6fa; color: #111; }
    h1, h2 { margin-bottom: 10px; }
    a { color: #0b57d0; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .card { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 14px; margin-bottom: 14px; }
    table { width: 100%; border-collapse: collapse; background: #fff; }
    th, td { border: 2px solid #222; padding: 10px; text-align: left; vertical-align: top; }
    th { background: #ececec; }
    form.inline { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    input[type="text"] { padding: 8px; border: 1px solid #bbb; border-radius: 5px; min-width: 180px; }
    button { padding: 8px 12px; border: none; border-radius: 5px; background: #0b57d0; color: #fff; cursor: pointer; }
    .danger { background: #b42318; }
    .ok { color: #067647; font-weight: 600; }
    .nav { display: grid; gap: 8px; margin-top: 12px; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function songsTable(rows) {
  const bodyRows = rows.map((song) => `
    <tr>
      <td>${song.Songname || ''}</td>
      <td>${song.Film || ''}</td>
      <td>${song.Music_director || ''}</td>
      <td>${song.singer || ''}</td>
      <td>${song.Actor || ''}</td>
      <td>${song.Actress || ''}</td>
    </tr>
  `).join('');

  return `
  <table>
    <thead>
      <tr>
        <th>Song Name</th>
        <th>Film Name</th>
        <th>Music Director</th>
        <th>Singer</th>
        <th>Actor</th>
        <th>Actress</th>
      </tr>
    </thead>
    <tbody>${bodyRows}</tbody>
  </table>`;
}

app.get('/', async (req, res) => {
  const total = await songs.countDocuments();
  const allSongs = await songs.find().toArray();

  const html = pageTemplate('Music DB Operations', `
    <h1>Music Database Operations</h1>
    <div class="card"><span class="ok">Total Songs: ${total}</span></div>
    ${songsTable(allSongs)}

    <div class="card nav">
      <a href="/seed">a+b+c) Create DB/Collection and insert 5 song documents</a>
      <a href="/all">d) Count and list all songs</a>
      <a href="/director/Pritam">e) List songs by Music Director (example: Pritam)</a>
      <a href="/director/Pritam/singer/Arijit%20Singh">f) Director + Singer filter (example)</a>
      <a href="/delete/Tum%20Hi%20Ho">g) Delete a song you don't like (example)</a>
      <a href="/add-favourite">h) Add a favourite song</a>
      <a href="/film/Brahmastra/singer/Arijit%20Singh">i) Songs by Singer from Film (example)</a>
      <a href="/update-cast/Kesariya">j) Update song by adding Actor/Actress (example)</a>
      <a href="/all">k) Display data in browser in tabular format</a>
    </div>

    <div class="card">
      <h2>Custom Query: Music Director</h2>
      <form class="inline" method="get" action="/search/director">
        <input type="text" name="name" placeholder="Enter Music Director" required />
        <button type="submit">Search</button>
      </form>
    </div>

    <div class="card">
      <h2>Custom Query: Director + Singer</h2>
      <form class="inline" method="get" action="/search/director-singer">
        <input type="text" name="director" placeholder="Music Director" required />
        <input type="text" name="singer" placeholder="Singer" required />
        <button type="submit">Search</button>
      </form>
    </div>

    <div class="card">
      <h2>Custom Query: Film + Singer</h2>
      <form class="inline" method="get" action="/search/film-singer">
        <input type="text" name="film" placeholder="Film" required />
        <input type="text" name="singer" placeholder="Singer" required />
        <button type="submit">Search</button>
      </form>
    </div>
  `);

  res.send(html);
});

app.get('/seed', async (req, res) => {
  await songs.deleteMany({});
  await songs.insertMany(initialSongs);
  res.redirect('/all');
});

app.get('/all', async (req, res) => {
  const total = await songs.countDocuments();
  const allSongs = await songs.find().toArray();
  res.send(pageTemplate('All Songs', `
    <h1>All Song Documents</h1>
    <p class="ok">Total Count: ${total}</p>
    ${songsTable(allSongs)}
    <p><a href="/">Back to Home</a></p>
  `));
});

app.get('/director/:name', async (req, res) => {
  const result = await songs.find({ Music_director: req.params.name }).toArray();
  res.send(pageTemplate('Songs by Director', `
    <h1>Songs by Music Director: ${req.params.name}</h1>
    ${songsTable(result)}
    <p><a href="/">Back to Home</a></p>
  `));
});

app.get('/director/:name/singer/:singer', async (req, res) => {
  const result = await songs.find({
    Music_director: req.params.name,
    singer: req.params.singer
  }).toArray();

  res.send(pageTemplate('Director + Singer', `
    <h1>${req.params.name} songs sung by ${req.params.singer}</h1>
    ${songsTable(result)}
    <p><a href="/">Back to Home</a></p>
  `));
});

app.get('/delete/:songname', async (req, res) => {
  await songs.deleteOne({ Songname: req.params.songname });
  res.redirect('/all');
});

app.get('/add-favourite', async (req, res) => {
  await songs.insertOne({
    Songname: 'Agar Tum Saath Ho',
    Film: 'Tamasha',
    Music_director: 'A. R. Rahman',
    singer: 'Alka Yagnik',
    Actor: 'Ranbir Kapoor',
    Actress: 'Deepika Padukone'
  });
  res.redirect('/all');
});

app.get('/film/:film/singer/:singer', async (req, res) => {
  const result = await songs.find({
    Film: req.params.film,
    singer: req.params.singer
  }).toArray();

  res.send(pageTemplate('Film + Singer', `
    <h1>Songs from ${req.params.film} sung by ${req.params.singer}</h1>
    ${songsTable(result)}
    <p><a href="/">Back to Home</a></p>
  `));
});

app.get('/update-cast/:songname', async (req, res) => {
  await songs.updateOne(
    { Songname: req.params.songname },
    {
      $set: {
        Actor: 'Ranbir Kapoor',
        Actress: 'Alia Bhatt'
      }
    }
  );
  res.redirect('/all');
});

app.get('/search/director', async (req, res) => {
  const name = req.query.name;
  const result = await songs.find({ Music_director: name }).toArray();
  res.send(pageTemplate('Search by Director', `
    <h1>Search Result: Director = ${name}</h1>
    ${songsTable(result)}
    <p><a href="/">Back to Home</a></p>
  `));
});

app.get('/search/director-singer', async (req, res) => {
  const { director, singer } = req.query;
  const result = await songs.find({ Music_director: director, singer }).toArray();
  res.send(pageTemplate('Search by Director + Singer', `
    <h1>Search Result: ${director} + ${singer}</h1>
    ${songsTable(result)}
    <p><a href="/">Back to Home</a></p>
  `));
});

app.get('/search/film-singer', async (req, res) => {
  const { film, singer } = req.query;
  const result = await songs.find({ Film: film, singer }).toArray();
  res.send(pageTemplate('Search by Film + Singer', `
    <h1>Search Result: ${film} + ${singer}</h1>
    ${songsTable(result)}
    <p><a href="/">Back to Home</a></p>
  `));
});

async function startServer() {
  await client.connect();
  const db = client.db(DB_NAME);
  songs = db.collection(COLLECTION_NAME);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Connected to MongoDB: ${MONGO_URI}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});