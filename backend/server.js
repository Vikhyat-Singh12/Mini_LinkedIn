import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { connectDB } from './src/utils/db.js';

import authRoutes from './src/routes/auth.route.js';
import postRoutes from './src/routes/post.route.js';

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5001",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV === 'production') {
  console.log('Production mode enabled');
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running`);
});
