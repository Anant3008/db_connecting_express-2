const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./schema"); // Import User model

const app = express();
const port = process.env.PORT || 3010;

app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// Serve static files
app.use(express.static("static"));

// Home route
app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

// POST API: Store user data
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Save user to the database
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
