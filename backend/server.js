require('dotenv').config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;
  console.log("Mensaje recibido:", message);

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: message }
      ]
    });

    const text = completion.choices[0].message.content;

    res.json({ text });

  } catch (error) {
    console.error(error);
    res.json({ text: "Error al comunicarse con la IA" });
  }
});

app.listen(3001, () => {
  console.log("Servidor backend funcionando en puerto 3001");
});