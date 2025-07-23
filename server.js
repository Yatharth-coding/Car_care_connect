require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "llama3-70b-8192",
    });

    const botReply = response.choices[0]?.message?.content || "I couldn't process that.";
    res.json({ reply: botReply });
    
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Failed to get response from Groq' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});