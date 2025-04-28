const axios = require('axios');

const callOpenRouter = async (userPrompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct", // You can use other models too
        messages: [{ role: "user", content: userPrompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API Error:", error.message);
    return "Sorry, something went wrong with the AI.";
  }
};

module.exports = callOpenRouter;
