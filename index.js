const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/auth");
const translateRoutes = require("./routes/translate");
const quizRoutes = require("./routes/quizRoutes");

dotenv.config(); // Load env variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api", authRoutes);
app.use("/api", translateRoutes);
app.use("/api/quiz", quizRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
