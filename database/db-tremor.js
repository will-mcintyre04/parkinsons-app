import { getDb } from '../database/db-service';

export const addTremorLog = (timestamp, frequency, amplitude, journal, medicineLogId) => {
  const db = getDb();

  db.runSync(
    `INSERT INTO TremorLogs (timestamp, frequency, amplitude, journal, medicine_log_id) VALUES (?, ?, ?, ?, ?)`,
    [timestamp, frequency, amplitude, journal, medicineLogId]
  );

  console.log('Tremor log inserted');
};

export const deleteTremorLog = (id) => {
  const db = getDb();
  db.runSync(`DELETE FROM TremorLogs WHERE id = ?`, [id]);
  console.log(`Deleted tremor log with ID: ${id}`);
};

export const getAllTremorLogs = () => {
  const db = getDb();
  const result = db.getAllSync(`SELECT * FROM TremorLogs ORDER BY timestamp DESC`);
  console.log('📊 Tremor Logs:', result);
  return result;
};

export const getTremorLogsSince = (sinceTimestamp: string) => {
    const db = getDb();
    const result = db.getAllSync(
      `SELECT * FROM TremorLogs WHERE timestamp >= ? ORDER BY timestamp ASC`,
      [sinceTimestamp]
    );
    return result;
  };
  