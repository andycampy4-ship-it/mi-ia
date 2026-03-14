require('dotenv').config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://geozvzeavypqxztwtkus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb3p2emVhdnlwcXh6dHd0a3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjgxMzcsImV4cCI6MjA4ODkwNDEzN30.BgTYWZ5mJeho6SM35is2vYy2iWDaCc0YuTkbDW9KsZQ"
);

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post("/chat", async (req, res) => {

  const { message, userId } = req.body;

  console.log("Mensaje recibido:", message);

  try {

    // 1️⃣ Obtener historial del usuario
    const { data: history } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(10);

    // 2️⃣ Convertir historial al formato de la IA
    const messages = history ? history.map(m => ({
      role: m.role,
      content: m.content
    })) : [];

    // 3️⃣ Añadir el nuevo mensaje del usuario
    messages.push({
      role: "user",
      content: message
    });

    // 4️⃣ Preguntar a la IA
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages
    });

    const text = completion.choices[0].message.content;

    // 5️⃣ Guardar mensaje del usuario
    await supabase.from("messages").insert([
      {
        user_id: userId,
        role: "user",
        content: message
      }
    ]);

    // 6️⃣ Guardar respuesta de la IA
    await supabase.from("messages").insert([
      {
        user_id: userId,
        role: "assistant",
        content: text
      }
    ]);

    res.json({ text });

  } catch (error) {
    console.error(error);
    res.json({ text: "Error al comunicarse con la IA" });
  }

});

app.listen(3001, () => {
  console.log("Servidor backend funcionando en puerto 3001");
});