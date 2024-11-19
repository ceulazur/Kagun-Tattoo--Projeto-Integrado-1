import express from "express";

const app = express();

app.get('/', (req, res) => { res.status(200).json({ message: 'Sistema de agendamento de tatuagens' }) })

export default app;
