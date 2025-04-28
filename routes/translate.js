const express = require('express');
const axios = require('axios');
const router = express.Router();

const supportedLanguages = [  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Russian', 
    'Arabic', 'Hindi', 'Korean', 'Turkish', 'Dutch', 'Swedish'];

router.post('/translate', async (req, res) => {
  const { text, language } = req.body;
  
  if (!supportedLanguages.includes(language)) {
    return res.status(400).send("Unsupported language");
  }

  const prompt = `Translate to ${language}: '${text}'`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      prompt: prompt,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const translatedText = response.data.choices[0].text.trim();
    res.json({ translatedText });
  } catch (err) {
    console.error("Error in OpenRouter translation:", err.response?.data || err.message);
    res.status(500).send("Translation failed");
  }
});


module.exports = router;
