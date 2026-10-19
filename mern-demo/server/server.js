
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API kiểm tra Backend
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend is running successfully"
  });
});

// Câu 36: GET - Lấy danh sách sinh viên
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Câu 37: POST - Thêm sinh viên
app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Câu 38: PUT - Cập nhật sinh viên
app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Câu 39: DELETE - Xóa sinh viên
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Kết nối MongoDB Atlas và chạy Backend
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${PORT}`);
    });

  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
    process.exit(1);
  }
}

startServer();
