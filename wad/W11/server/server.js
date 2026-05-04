const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = []; // ARRAY STORAGE (as required)

// REGISTER
app.post("/register", (req, res) => {
    const user = req.body;

    // check duplicate email
    if (users.find(u => u.email === user.email)) {
        return res.status(400).json({ message: "Email already exists" });
    }

    users.push(user);
    res.json({ message: "User registered successfully" });
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
});

// GET USERS (for dashboard)
app.get("/users", (req, res) => {
    res.json(users);
});

app.listen(3000, () => console.log("Server running on port 3000"));