// auth-service/src/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/authdb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`Auth Service démarré sur le port ${PORT}`);
});
