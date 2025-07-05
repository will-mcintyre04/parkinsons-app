// db-service.js
import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = () => {
  try {
    db = SQLite.openDatabaseSync('parkinson.db');
    console.log('SQLite DB (sync) opened');

    db.execSync(`
      CREATE TABLE IF NOT EXISTS MedicineLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        medication TEXT NOT NULL,
        dosage TEXT NOT NULL,
        journal TEXT
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS TremorLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        frequency REAL NOT NULL,
        amplitude REAL NOT NULL,
        medicine_log_id INTEGER,
        FOREIGN KEY (medicine_log_id) REFERENCES MedicineLogs(id)
          ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    console.log('Tables created with execSync');
  } catch (err) {
    console.error('DB Init (sync) failed:', err);
  }
};

export const getDb = () => {
  if (!db) throw new Error('⚠️ DB not initialized. Call initDatabase() first.');
  return db;
};

