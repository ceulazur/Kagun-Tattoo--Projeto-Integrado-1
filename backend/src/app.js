import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import notFoundMiddleware from './middlewares/notFoundMiddleware.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
