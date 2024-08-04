const { GoogleGenerativeAI } = require('@google/generative-ai');

// Accéder à votre clé API via une variable d'environnement
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generateResponse(req, res) { 
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).send({ error: 'Message is required.' });
    }

    // Préparer le modèle pour la génération
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Respond to the following message: "${message}"`;

    // Génération du contenu
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    res.send({ reply: text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send({ error: 'Error generating response' });
  }
}

module.exports = { generateResponse };

