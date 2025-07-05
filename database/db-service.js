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
        dosage TEXT NOT NULL
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS TremorLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        frequency REAL NOT NULL,
        amplitude REAL NOT NULL,
        journal TEXT,
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

export const printAllData = () => {
  const db = getDb();

  const meds = db.getAllSync(`SELECT * FROM MedicineLogs`);
  const tremors = db.getAllSync(`SELECT * FROM TremorLogs`);

  console.log('💊 Medicine Logs:', meds);
  console.log('🌡️ Tremor Logs:', tremors);
};

export const resetDatabase = () => {
  try {
    const db = getDb();

    db.execSync(`DROP TABLE IF EXISTS TremorLogs;`);
    db.execSync(`DROP TABLE IF EXISTS MedicineLogs;`);

    console.log('🧨 All tables dropped. Recreating schema...');

    // Recreate tables (same as in initDatabase)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS MedicineLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        medication TEXT NOT NULL,
        dosage TEXT NOT NULL
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS TremorLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        frequency REAL NOT NULL,
        amplitude REAL NOT NULL,
        journal TEXT,
        medicine_log_id INTEGER,
        FOREIGN KEY (medicine_log_id) REFERENCES MedicineLogs(id)
          ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    console.log('✅ Database has been reset and migrated');
  } catch (err) {
    console.error('❌ Failed to reset database:', err);
  }
};
