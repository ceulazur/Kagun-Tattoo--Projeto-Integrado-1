import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
