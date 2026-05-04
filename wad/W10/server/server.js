const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];
let id = 1;

// GET
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// POST
app.post("/tasks", (req, res) => {
    const task = { id: id++, text: req.body.text };
    tasks.push(task);
    res.json(task);
});

// PUT
app.put("/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (task) task.text = req.body.text;
    res.json(task);
});

// DELETE
app.delete("/tasks/:id", (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log("Server running on port 3000"));