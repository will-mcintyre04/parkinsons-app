import { getDb } from './db-service';

// Insert a new medicine log entry
export const addMedicineLog = (timestamp, medication, dosage, journal) => {
  const db = getDb();

  db.runSync(
    `INSERT INTO MedicineLogs (timestamp, medication, dosage, journal) VALUES (?, ?, ?, ?)`,
    [timestamp, medication, dosage, journal]
  );

  console.log('Medicine log inserted');
};

// Delete a specific medicine log entry by ID
export const deleteMedicineLog = (id) => {
    const db = getDb();
  
    db.runSync(`DELETE FROM MedicineLogs WHERE id = ?`, [id]);
  
    console.log(`🗑️ Deleted medicine log with ID: ${id}`);
  };


// Find All Medicine Logs
export const getAllMedicineLogs = () => {
    const db = getDb();
    const result = db.getAllSync(`SELECT * FROM MedicineLogs ORDER BY timestamp DESC`);
    console.log('Medicine Logs:', result);
    return result;
  };
