import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Client } from 'pg';


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.options('*', cors()); 

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
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
app.post('/api/save-credentials', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("account creato")
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
app.post('/api/check-credentials', async (req, res) => {
  try {
    // 1. Controlla connessione al database
    if (!client._connected) {
      console.error('⚠️ Tentativo di accesso con database disconnesso');
      return res.status(500).json({ 
        error: "Database non disponibile",
        details: "Il server non può connettersi al database"
      });
    }

    // 2. Valida l'input
    if (!req.body || !req.body.email) {
      console.warn('❌ Richiesta malformata:', req.body);
      return res.status(400).json({ 
        error: "Email mancante",
        details: "Il campo 'email' è obbligatorio nel body della richiesta"
      });
    }

    const { email } = req.body;

    // 3. Log della richiesta (solo in sviluppo)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔍 Verifica credenziali per: ${email}`);
    }

    // 4. Interroga il database
    const result = await client.query(
      'SELECT 1 FROM Utenti WHERE email = $1',
      [email]
    );

    // 5. Risposta
    const exists = result.rowCount > 0;
    
    if (exists) {
      console.log(`✅ Email trovata: ${email}`);
    } else {
      console.warn(`⚠️ Email non registrata: ${email}`);
    }

    res.status(200).json({ 
      exists,
      message: exists ? "Email esistente" : "Email non registrata"
    });

  } catch (err) {
    // 6. Gestione errori
    console.error('🔥 Errore in /check-credentials:', err.stack);
    
    res.status(500).json({
      error: "Errore interno del server",
      details: process.env.NODE_ENV === 'production' 
        ? "Si è verificato un errore" 
        : err.message,
      code: "DB_QUERY_ERROR"
    });
  }
});

// Endpoint per verificare credenziali complete
app.post('/api/check-all-credentials', async (req, res) => {
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
app.post('/api/del-credentials', async (req, res) => {
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
app.post('/api/change-credentials', async (req, res) => {
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
app.get('/api/get-credentials', async (req, res) => {
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
