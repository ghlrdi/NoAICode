import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Client } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurazione CORS corretta
app.use(cors({
  origin: ['https://efficient-celebration-production.up.railway.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware di logging avanzato
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// Configurazione PostgreSQL
const pgConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  ssl: process.env.DB_SSL === 'true'
};

const client = new Client(pgConfig);

client.connect()
  .then(() => console.log('✅ Connesso al database PostgreSQL'))
  .catch(err => console.error('❌ Errore connessione database:', err));

// Middleware per iniettare il client nelle request
app.use((req, res, next) => {
  req.db = client;
  req.dbConnected = client._connected || false;
  next();
});

// ======================================
// TUTTE LE ROUTE API DEVONO VENIRE PRIMA
// ======================================

// Endpoint di test semplice
app.post('/api/test-post', (req, res) => {
  res.json({ 
    success: true,
    message: "Test POST funzionante",
    receivedBody: req.body
  });
});

// Endpoint per verificare esistenza email
app.post('/api/check-credentials', async (req, res) => {
  try {
    if (!client._connected) {
      return res.status(500).json({ 
        error: "Database non disponibile"
      });
    }

    if (!req.body?.email) {
      return res.status(400).json({ 
        error: "Email mancante"
      });
    }

    const { email } = req.body;
    const result = await client.query(
      'SELECT 1 FROM utenti WHERE email = $1',
      [email]
    );
    
    const exists = result.rowCount > 0;
    res.status(200).json({ exists });
  } catch (err) {
    console.error('Errore in /check-credentials:', err);
    res.status(500).json({
      error: "Errore interno del server",
      details: process.env.NODE_ENV === 'production' ? null : err.message
    });
  }
});

// Endpoint per salvare credenziali
app.post('/api/save-credentials', async (req, res) => {
  const { email, password } = req.body;
  try {
    await client.query(
      'INSERT INTO utenti (email, password) VALUES ($1, $2)',
      [email, password]
    );
    res.status(200).json({ message: 'Dati salvati correttamente' });
  } catch (err) {
    console.error('Errore in /save-credentials:', err);
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});

// Endpoint per verificare credenziali complete
app.post('/api/check-all-credentials', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query(
      'SELECT 1 FROM utenti WHERE email = $1 AND password = $2',
      [email, password]
    );
    res.status(200).json({ exists: result.rowCount > 0 });
  } catch (err) {
    console.error('Errore in /check-all-credentials:', err);
    res.status(500).json({ error: 'Errore nel controllo credenziali' });
  }
});

// Endpoint per eliminare credenziali
app.post('/api/del-credentials', async (req, res) => {
  const { email } = req.body;
  try {
    await client.query(
      'DELETE FROM utenti WHERE email = $1',
      [email]
    );
    res.status(200).json({ message: 'Dati eliminati correttamente' });
  } catch (err) {
    console.error('Errore in /del-credentials:', err);
    res.status(500).json({ error: "Errore nell'eliminazione" });
  }
});

// Endpoint per modificare password
app.post('/api/change-credentials', async (req, res) => {
  const { email, password } = req.body;
  try {
    await client.query(
      'UPDATE utenti SET password = $1 WHERE email = $2',
      [password, email]
    );
    res.status(200).json({ message: 'Password modificata' });
  } catch (err) {
    console.error('Errore in /change-credentials:', err);
    res.status(500).json({ error: 'Errore nel cambio password' });
  }
});

// Endpoint per ottenere tutti gli utenti
app.get('/api/get-credentials', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM utenti');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Errore in /get-credentials:', err);
    res.status(500).json({ error: 'Errore nel recupero dati' });
  }
});

// Endpoint di test per deployment
app.get('/api/test-fetch', (req, res) => {
  res.status(200).json({ message: "Test fetch OK" });
});

// ======================================
// SOLO DOPO TUTTE LE API:
// ======================================

// Serve static files from Vite's build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all SOLO per GET (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Avvio server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  console.log(`Modalità: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Connesso al DB: ${client._connected ? '✅' : '❌'}`);
});