import express from 'express';
import errorHandler from './middlewares/error';
import dotenv from 'dotenv';
import cors from 'cors';
import { NODE_ENV } from './utils/env';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../doc/swagger.json'), 'utf-8')
);

dotenv.config({
  quiet: NODE_ENV === 'production',
});

const app = express();

app.use(cors());

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;
