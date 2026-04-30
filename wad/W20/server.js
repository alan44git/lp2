const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'employeeDB';
const COLLECTION_NAME = 'employees';

app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(MONGO_URI);
let employees;

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
      max-width: 1050px;
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

function employeeForm(action, employee = {}) {
  return `
    <form method="post" action="${action}">
      <h2>${employee._id ? 'Update Employee' : 'Add Employee'}</h2>
      <div class="form-row">
        <input type="text" name="name" placeholder="Name" value="${employee.name || ''}" required>
        <input type="text" name="department" placeholder="Department" value="${employee.department || ''}" required>
        <input type="text" name="designation" placeholder="Designation" value="${employee.designation || ''}" required>
        <input type="number" name="salary" placeholder="Salary" value="${employee.salary || ''}" required>
        <input type="date" name="joiningDate" value="${employee.joiningDate || ''}" required>
      </div>
      <button type="submit">${employee._id ? 'Update Employee' : 'Add Employee'}</button>
      ${employee._id ? '<a href="/">Cancel</a>' : ''}
    </form>
  `;
}

function employeeTable(employeeList) {
  const rows = employeeList.map((employee) => `
    <tr>
      <td>${employee.name}</td>
      <td>${employee.department}</td>
      <td>${employee.designation}</td>
      <td>${employee.salary}</td>
      <td>${employee.joiningDate}</td>
      <td>
        <div class="actions">
          <a href="/edit/${employee._id}">Edit</a>
          <form method="post" action="/delete/${employee._id}" style="margin:0; padding:0; border:0; background:transparent;">
            <button type="submit">Delete</button>
          </form>
        </div>
      </td>
    </tr>
  `).join('');

  return `
    <h2>Employee Records</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Department</th>
          <th>Designation</th>
          <th>Salary</th>
          <th>Joining Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="6">No employee records found</td></tr>'}
      </tbody>
    </table>
  `;
}

async function renderHome(res, editEmployee = null) {
  const employeeList = await employees.find().sort({ name: 1 }).toArray();
  const form = editEmployee
    ? employeeForm(`/update/${editEmployee._id}`, editEmployee)
    : employeeForm('/add');

  res.send(pageTemplate('Employee Management', `
    <h1>Employee Management</h1>
    ${form}
    ${employeeTable(employeeList)}
  `));
}

app.get('/', async (req, res) => {
  await renderHome(res);
});

app.post('/add', async (req, res) => {
  await employees.insertOne({
    name: req.body.name,
    department: req.body.department,
    designation: req.body.designation,
    salary: Number(req.body.salary),
    joiningDate: req.body.joiningDate
  });

  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const employee = await employees.findOne({ _id: new ObjectId(req.params.id) });
  await renderHome(res, employee);
});

app.post('/update/:id', async (req, res) => {
  await employees.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        name: req.body.name,
        department: req.body.department,
        designation: req.body.designation,
        salary: Number(req.body.salary),
        joiningDate: req.body.joiningDate
      }
    }
  );

  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await employees.deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect('/');
});

async function startServer() {
  await client.connect();
  const db = client.db(DB_NAME);
  employees = db.collection(COLLECTION_NAME);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Connected to database: ${DB_NAME}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
