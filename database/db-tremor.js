import { getDb } from '../database/db-service';

export const addTremorLog = (timestamp, frequency, intensity, journal, medicineLogId) => {
  const db = getDb();

  db.runSync(
    `INSERT INTO TremorLogs (timestamp, frequency, intensity, journal, medicine_log_id) VALUES (?, ?, ?, ?, ?)`,
    [timestamp, frequency, intensity, journal, medicineLogId]
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

export const getTremorLogsByFilter = (since: string, medicineId: number | null) => {
    const db = getDb();

    if (medicineId) {
        return db.getAllSync(
        `SELECT * FROM TremorLogs WHERE timestamp >= ? AND medicine_log_id = ? ORDER BY timestamp ASC`,
        [since, medicineId]
        );
    } else {
        return db.getAllSync(
        `SELECT * FROM TremorLogs WHERE timestamp >= ? ORDER BY timestamp ASC`,
        [since]
        );
    }
};
  