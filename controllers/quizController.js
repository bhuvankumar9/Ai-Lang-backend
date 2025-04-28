const axios = require('axios');
const Attempt = require('../models/QuizAttempt');

const generateQuiz = async (req, res) => {
  const { language, level } = req.body;

  const prompt = `Create a ${level} level multiple-choice language quiz to help an English speaker learn ${language}.
  Each question should be written in English, asking for the ${language} word of something.
  Return 5 questions, each with:
  - question (in English)
  - options (a to d) with ${language} words
  - correctAnswer (the key a/b/c/d)
  Format response as JSON only.`;
  
  
  

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a quiz generator.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const raw = response.data.choices[0].message.content.trim();

    // Extract and parse JSON safely
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']') + 1;
    const json = raw.substring(start, end);

    const quiz = JSON.parse(json);

    // Save dummy attempt (optional – can be used later for score)
    // await Attempt.create({ language, level, score: 0 });

    res.json({ quiz });
  } catch (err) {
    console.error("Quiz generation error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
};

module.exports = { generateQuiz };
