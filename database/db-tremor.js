import { getDb } from '../database/db-service';

export const addTremorLog = (timestamp, frequency, amplitude, medicineLogId) => {
  const db = getDb();

  db.runSync(
    `INSERT INTO TremorLogs (timestamp, frequency, amplitude, medicine_log_id) VALUES (?, ?, ?, ?)`,
    [timestamp, frequency, amplitude, medicineLogId]
  );

  console.log('Tremor log inserted');
};

// Delete a specific tremor log entry by ID
export const deleteTremorLog = (id) => {
    const db = getDb();
  
    db.runSync(`DELETE FROM TremorLogs WHERE id = ?`, [id]);
  
    console.log(`🗑️ Deleted tremor log with ID: ${id}`);
  };

// Find all Tremor Logs
export const getAllTremorLogs = () => {
    const db = getDb();
    const result = db.getAllSync(`SELECT * FROM TremorLogs ORDER BY timestamp DESC`);
    console.log('📊 Tremor Logs:', result);
    return result; // an array of row objects
  };
