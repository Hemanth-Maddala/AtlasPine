const express = require('express');
const axios = require('axios');
const { authRequired } = require('../middleware/auth');


const router = express.Router();
router.use(authRequired);

console.log("medical route loaded");

const AI_SERVICE="https://atlaspine.onrender.com"
// -------------------- Medical question --------------------
router.post('/', async (req, res) => {
  console.log("medical route loaded");
  try {
    const question = req.body.question;
    console.log("🔹 Received medical question:", question);

    const response = await axios.post(
    `${AI_SERVICE}/api/medical`,
      { question },
      { headers: { "Content-Type": "application/json" } ,
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      } 

      // This timeout is because -> actually render waits for mostly 10seconds to repond to any user i/p athat means to transfer data between the URLs/requests
      // but actually we are calling the gemini-ai which takes sometime to generate answer and to return the data so that render crashes and stops the request within 10 seconds
      // so timeout helps to increase the time to wait for the data to transfer
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error connecting to medical AI service:", err.message);
    res.status(500).json({ error: "Error connecting to medical AI service" });
  }
});

module.exports = router;
