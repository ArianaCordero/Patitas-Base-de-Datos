import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectMongo from './src/config/mongodb.js';
import pool from './src/config/postgres.js';
import clientesRouter from './src/routes/clientes.js';
import pedidosRouter from './src/routes/pedidos.js';
import catalogoRouter from './src/routes/catalogo.js';
import carritoRouter from './src/routes/carrito.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/clientes', clientesRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/catalogo', catalogoRouter);
app.use('/api/carrito', carritoRouter);

app.get('/api/health', async (_req, res) => {
  const pg = await pool.query('SELECT 1');
  res.json({
    status: 'ok',
    postgres: !!pg,
    mongo: mongoose.connection.readyState === 1
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const start = async () => {
  await connectMongo();
  await pool.query('SELECT 1');
  console.log('PostgreSQL conectado');
  const PORT = process.env.PORT ?? 3001;
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
};

start().catch(console.error);