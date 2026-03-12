require('dotenv').config(); // Para leer la API Key desde .env
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para recibir mensajes del frontend y enviar a la IA
app.post("/chat", async (req, res) => {
    const message = req.body.message;

    console.log("Mensaje recibido del frontend:", message);

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            { inputs: message },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Respuesta de Hugging Face:", response.data);

        // Dependiendo del modelo, a veces está en data[0].generated_text
        const text = response.data[0]?.generated_text || response.data?.generated_text || "Sin respuesta";
        res.json({ text });

    } catch (error) {
        console.error("Error al comunicarse con la IA:", error.response?.data || error.message);
        res.json({ text: "Error al comunicarse con la IA" });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor backend funcionando en puerto ${PORT}`));