require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// ======= CHECK ENV VARIABLES =======
if (!process.env.ATLAS_URI || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: ATLAS_URI or JWT_SECRET missing in .env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// ======= CONNECT TO MONGODB =======
mongoose
  .connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ======= USER SCHEMA =======
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  uploads: [
    {
      filename: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }
  ]
});
const User = mongoose.model("User", userSchema);

// ======= AUTH MIDDLEWARE =======
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ======= MULTER STORAGE CONFIG =======
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ======= SIGNUP =======
app.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "Full name, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======= LOGIN =======
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======= UPLOAD IMAGE =======
app.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.uploads.push({ filename: req.file.filename, fileUrl });
    await user.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      fileUrl,
      uploads: user.uploads
    });
  } catch (err) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======= GET UPLOAD HISTORY =======
app.get("/uploads/history", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("uploads");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ uploads: user.uploads });
  } catch (err) {
    console.error("History Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======= STATIC FILES FOR UPLOADS =======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======= START SERVER =======
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
