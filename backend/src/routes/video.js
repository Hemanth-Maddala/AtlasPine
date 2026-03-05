const express = require('express');
const axios = require('axios');
const { authRequired } = require('../middleware/auth');


const router = express.Router();
router.use(authRequired);
AI_SERVICE="https://atlaspine.onrender.com"

// -------------------- Video summarization --------------------
router.post('/', async (req, res) => {
  console.log("video route loaded");
  const axios = require('axios');
  try {
    const video_url = req.body.url;
    console.log("🔹 Received video URL:", video_url);
    const response = await axios.post(
      `${AI_SERVICE}/api/summarize_video`,
      { video_url },
      { headers: { "Content-Type": "application/json" } }
    );
    res.json(response.data);
  } catch (err) {   
    console.error("Error connecting to video summarization service:", err.message);
    res.status(500).json({ error: "Error connecting to video summarization service" });
  }
});

module.exports = router;