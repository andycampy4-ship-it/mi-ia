import { useState } from "react";

function App() {

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {

    const res = await fetch("https://mi-ia-backend-g55p.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        userId: "usuario1"
      })
    });

    const data = await res.json();

    setResponse(data.text);

  };

  return (
    <div style={{ padding: "40px" }}>

      <h1>Mi IA 🤖</h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe algo..."
        style={{ width: "300px", padding: "5px" }}
      />

      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
        Enviar
      </button>

      <div style={{ marginTop: "20px" }}>
        <strong>Respuesta IA:</strong>
        <p>{response}</p>
      </div>

    </div>
  );

}

export default App;