const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'student';
const COLLECTION_NAME = 'studentmarks';

app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(MONGO_URI);
let studentmarks;

const sampleStudents = [
  {
    Name: 'ABC',
    Roll_No: 111,
    WAD_Marks: 25,
    DSBDA_Marks: 25,
    CNS_Marks: 25,
    CC_Marks: 25,
    AI_Marks: 25
  },
  {
    Name: 'PQR',
    Roll_No: 112,
    WAD_Marks: 35,
    DSBDA_Marks: 22,
    CNS_Marks: 45,
    CC_Marks: 30,
    AI_Marks: 38
  },
  {
    Name: 'XYZ',
    Roll_No: 113,
    WAD_Marks: 18,
    DSBDA_Marks: 19,
    CNS_Marks: 28,
    CC_Marks: 15,
    AI_Marks: 30
  },
  {
    Name: 'LMN',
    Roll_No: 114,
    WAD_Marks: 42,
    DSBDA_Marks: 41,
    CNS_Marks: 39,
    CC_Marks: 44,
    AI_Marks: 40
  },
  {
    Name: 'DEF',
    Roll_No: 115,
    WAD_Marks: 28,
    DSBDA_Marks: 32,
    CNS_Marks: 29,
    CC_Marks: 31,
    AI_Marks: 27
  }
];

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

    h1, h2 {
      margin-top: 0;
    }

    .container {
      max-width: 1000px;
      margin: auto;
      background: white;
      padding: 18px;
      border: 1px solid #ccc;
    }

    .actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 12px;
      margin-bottom: 18px;
    }

    .box {
      border: 1px solid #ccc;
      padding: 12px;
      background: #fafafa;
    }

    a, button {
      display: inline-block;
      padding: 8px 12px;
      border: 1px solid #333;
      background: #eee;
      color: #111;
      text-decoration: none;
      cursor: pointer;
      font-size: 14px;
    }

    input {
      padding: 8px;
      border: 1px solid #999;
      margin-bottom: 8px;
      width: 100%;
      box-sizing: border-box;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      margin-top: 12px;
    }

    th, td {
      border: 2px solid #111;
      padding: 10px;
      text-align: left;
    }

    th {
      background: #eee;
    }

    .message {
      font-weight: bold;
      margin: 10px 0;
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

function studentTable(students) {
  const rows = students.map((student) => `
    <tr>
      <td>${student.Name}</td>
      <td>${student.Roll_No}</td>
      <td>${student.WAD_Marks}</td>
      <td>${student.DSBDA_Marks}</td>
      <td>${student.CNS_Marks}</td>
      <td>${student.CC_Marks}</td>
      <td>${student.AI_Marks}</td>
    </tr>
  `).join('');

  return `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Roll No</th>
          <th>WAD</th>
          <th>DSBDA</th>
          <th>CNS</th>
          <th>CC</th>
          <th>AI</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="7">No records found</td></tr>'}
      </tbody>
    </table>
  `;
}

function homePage(students, total, message = '') {
  return pageTemplate('Student Marks', `
    <h1>Student Marks</h1>
    ${message ? `<p class="message">${message}</p>` : ''}

    <div class="actions">
      <div class="box">
        <form method="post" action="/insert">
          <button type="submit">Insert Sample Students</button>
        </form>
      </div>

      <div class="box">
        <a href="/all">Show All Students</a>
      </div>

      <div class="box">
        <a href="/dsbda-above-20">DSBDA Marks Above 20</a>
      </div>

      <div class="box">
        <a href="/all-subjects-above-25">Above 25 In All Subjects</a>
      </div>

      <div class="box">
        <a href="/low-wad-cc">Below 40 In WAD And CC</a>
      </div>

      <div class="box">
        <form method="post" action="/update">
          <input type="number" name="rollNo" placeholder="Enter roll number" required>
          <button type="submit">Increase Marks By 10</button>
        </form>
      </div>

      <div class="box">
        <form method="post" action="/delete">
          <input type="number" name="rollNo" placeholder="Enter roll number" required>
          <button type="submit">Remove Student</button>
        </form>
      </div>
    </div>

    <h2>Total Documents: ${total}</h2>
    ${studentTable(students)}
  `);
}

app.get('/', async (req, res) => {
  const students = await studentmarks.find().sort({ Roll_No: 1 }).toArray();
  const total = await studentmarks.countDocuments();
  res.send(homePage(students, total));
});

app.post('/insert', async (req, res) => {
  await studentmarks.deleteMany({});
  await studentmarks.insertMany(sampleStudents);
  res.redirect('/all');
});

app.get('/all', async (req, res) => {
  const students = await studentmarks.find().sort({ Roll_No: 1 }).toArray();
  const total = await studentmarks.countDocuments();
  res.send(homePage(students, total, 'All student records are displayed below.'));
});

app.get('/dsbda-above-20', async (req, res) => {
  const students = await studentmarks.find({ DSBDA_Marks: { $gt: 20 } }).sort({ Roll_No: 1 }).toArray();
  const total = students.length;
  res.send(homePage(students, total, 'Students with DSBDA marks above 20.'));
});

app.post('/update', async (req, res) => {
  const rollNo = Number(req.body.rollNo);

  await studentmarks.updateOne(
    { Roll_No: rollNo },
    {
      $inc: {
        WAD_Marks: 10,
        DSBDA_Marks: 10,
        CNS_Marks: 10,
        CC_Marks: 10,
        AI_Marks: 10
      }
    }
  );

  res.redirect('/all');
});

app.get('/all-subjects-above-25', async (req, res) => {
  const students = await studentmarks.find({
    WAD_Marks: { $gt: 25 },
    DSBDA_Marks: { $gt: 25 },
    CNS_Marks: { $gt: 25 },
    CC_Marks: { $gt: 25 },
    AI_Marks: { $gt: 25 }
  }).sort({ Roll_No: 1 }).toArray();

  res.send(homePage(students, students.length, 'Students with more than 25 marks in all subjects.'));
});

app.get('/low-wad-cc', async (req, res) => {
  const students = await studentmarks.find({
    WAD_Marks: { $lt: 40 },
    CC_Marks: { $lt: 40 }
  }).sort({ Roll_No: 1 }).toArray();

  res.send(homePage(students, students.length, 'Students with less than 40 marks in WAD and CC.'));
});

app.post('/delete', async (req, res) => {
  const rollNo = Number(req.body.rollNo);
  await studentmarks.deleteOne({ Roll_No: rollNo });
  res.redirect('/all');
});

async function startServer() {
  await client.connect();
  const db = client.db(DB_NAME);
  studentmarks = db.collection(COLLECTION_NAME);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Connected to database: ${DB_NAME}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
