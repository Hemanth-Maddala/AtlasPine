const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { authRequired } = require("../middleware/auth");

const router = express.Router();
router.use(authRequired);

console.log("pdfQA.js loaded");

// Upload folder
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- /summarize route ---
router.post("/summarize", upload.single("pdf"), async (req, res) => {
  
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const filePath = path.resolve(req.file.path);
    console.log("📄 Received PDF:", filePath);

    // send to Flask
    const formData = new FormData();
    formData.append("pdf", fs.createReadStream(filePath));

    const response = await axios.post("http://localhost:8000/api/pdf/summarize", formData, {
      headers: formData.getHeaders(),
    });

    // delete local temp file
    fs.unlink(filePath, () => {});
    res.json(response.data);
  } catch (err) {
    console.error("Summarize error:", err.message);
    res.status(500).json({ error: "Failed to summarize PDF" });
  }
});

// --- /ask route ---
router.use("/ask", express.json());
router.post("/ask", async (req, res) => {
  try {
    console.log(req.body);
    const { question } = req.body;
    console.log("Ask route accessed with question:", question);
    if (!question) return res.status(400).json({ error: "No question provided" });

    const response = await axios.post("http://localhost:8000/api/pdf/ask", { question });
    res.json(response.data);
  } catch (err) {
    console.error("Ask error:", err.message);
    res.status(500).json({ error: "Failed to get answer" });
  }
});

module.exports = router;
