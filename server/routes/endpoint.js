import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Client } from 'pg';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.options('*', cors()); 
// Configurazione PostgreSQL
const pgConfig = {
  user: process.env.DB_USER || 'stefano',
  password: process.env.DB_PASSWORD || 'Stefano2025@',
  host: process.env.DB_HOST || '109.234.62.45',
  database: process.env.DB_NAME || 'mydb',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL === 'false'
};

// Creazione e connessione del client
const client = new Client(pgConfig);
(async () => {
  try {
    await client.connect();
    console.log('✅ Connesso al database PostgreSQL');
    

    // Avvio server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
  } catch (err) {
    console.error('❌ Errore connessione database:', err);
    process.exit(1);
  }
})();

// Middleware per iniettare il client nelle request
app.use((req, res, next) => {
  req.db = client;
  next();
});

// Endpoint per salvare credenziali
app.post('/save-credentials', async (req, res) => {
  const { email, password } = req.body;

  try {
    await req.db.query(
      'INSERT INTO Utenti (email, password) VALUES ($1, $2)',
      [email, password]
    );
    res.status(200).json({ message: 'Dati salvati correttamente' });
  } catch (err) {
    console.error('❌ ERRORE DETTAGLIATO:', err);
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});

// Endpoint per verificare esistenza email
app.post('/check-credentials', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await req.db.query(
      'SELECT 1 FROM Utenti WHERE email = $1',
      [email]
    );
    res.status(200).json({ exists: result.rowCount > 0 });
  } catch (err) {
    console.error('❌ ERRORE DETTAGLIATO:', err);
    res.status(500).json({ error: 'Errore nel controllo email' });
  }
});

// Endpoint per verificare credenziali complete
app.post('/check-all-credentials', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await req.db.query(
      'SELECT 1 FROM Utenti WHERE email = $1 AND password = $2',
      [email, password]
    );
    res.status(200).json({ exists: result.rowCount > 0 });
  } catch (err) {
    console.error('❌ ERRORE DETTAGLIATO:', err);
    res.status(500).json({ error: 'Errore nel controllo credenziali' });
  }
});

// Endpoint per eliminare credenziali
app.post('/del-credentials', async (req, res) => {
  const { email } = req.body;

  try {
    await req.db.query(
      'DELETE FROM Utenti WHERE email = $1',
      [email]
    );
    res.status(200).json({ message: 'Dati eliminati correttamente' });
  } catch (err) {
    console.error('❌ ERRORE DETTAGLIATO:', err);
    res.status(500).json({ error: "Errore nell'eliminazione dell'account" });
  }
});

// Endpoint per modificare password
app.post('/change-credentials', async (req, res) => {
  const { email, password } = req.body;

  try {
    await req.db.query(
      'UPDATE Utenti SET password = $1 WHERE email = $2',
      [password, email]
    );
    res.status(200).json({ message: 'Password modificata correttamente' });
  } catch (err) {
    console.error('❌ ERRORE DETTAGLIATO:', err);
    res.status(500).json({ error: 'Errore nel cambio password' });
  }
});

// Endpoint per ottenere tutti gli utenti
app.get('/get-credentials', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM Utenti');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ ERRORE DETTAGLIATO:', err);
    res.status(500).json({ error: 'Errore nel recupero dati' });
  }
});

// Endpoint di test
app.get('/', (req, res) => {
  res.send('🚀 Server Express attivo con PostgreSQL!');
});