const express = require('express');
const axios = require('axios');
const { authRequired } = require('../middleware/auth');


const router = express.Router();
router.use(authRequired);

console.log("medical route loaded");

const AI_SERVICE = process.env.AI_SERVICE_URL;
// -------------------- Medical question --------------------
router.post('/', async (req, res) => {
  console.log("medical route loaded");
  const axios = require('axios');
  try {
    const question = req.body.question;
    console.log("🔹 Received medical question:", question);

    const response = await axios.post(
      `${AI_SERVICE}/api/medical`,
      { question },
      { headers: { "Content-Type": "application/json" } }  // ✅ important
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error connecting to medical AI service:", err.message);
    res.status(500).json({ error: "Error connecting to medical AI service" });
  }
});

module.exports = router;
