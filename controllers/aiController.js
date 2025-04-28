const callOpenRouter = require("../utils/openRouter");

const translateText = async (req, res) => {
  const { text, targetLang } = req.body;

  const prompt = `Translate this to ${targetLang}: ${text}`;

  const translation = await callOpenRouter(prompt);

  res.json({ translation });
};

module.exports = { translateText };
