const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connectdb');
const smartphoneRoutes = require('./routes/smartphoneRoutes');

dotenv.config();

// Connexion à MongoDB
connectDB();

// Création de l’application Express
const app = express();

// Autoriser un body JSON plus gros (ex: 10mb)
app.use(express.json({ limit: "50mb" }));

// Middleware de traçage pour voir les requêtes reçues
app.use((req, res, next) => {
  console.log(`➡️ Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Configuration CORS
app.use(cors({
  origin: [
    'http://filrouge.local:30080',
    'http://localhost:30000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes API
app.use('/api', smartphoneRoutes); // PAS '/api' car Ingress réécrit déjà

// Route pour la liveness probe
app.get('/health', (req, res) => res.sendStatus(200));

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`✅ Serveur lancé sur http://0.0.0.0:${PORT}`)
);
