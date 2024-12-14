import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./AuthContext";
import Router from "./routes";
import "./styles/buttons.css";
import "./styles/colors.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/typography.css";

function App() {
  useEffect(() => {
    // Envio de mensagem ao processo principal
    window.api.send("toMain", "Dados para o processo principal");

    // Recebimento de mensagem do processo principal
    window.api.receive("fromMain", (data) => {
      console.log("Recebido do processo principal:", data);
    });
  }, []);

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
