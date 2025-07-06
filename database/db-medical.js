import { getDb } from './db-service';

export const addMedicineLog = (timestamp, medication, dosage) => {
  const db = getDb();

  db.runSync(
    `INSERT INTO MedicineLogs (timestamp, medication, dosage) VALUES (?, ?, ?)`,
    [timestamp, medication, dosage]
  );

  console.log('Medicine log inserted');
};

export const deleteMedicineLog = (id) => {
  const db = getDb();
  db.runSync(`DELETE FROM MedicineLogs WHERE id = ?`, [id]);
  console.log(`Deleted medicine log with ID: ${id}`);
};

export const getAllMedicineLogs = () => {
  const db = getDb();
  const result = db.getAllSync(`SELECT * FROM MedicineLogs ORDER BY timestamp DESC`);
  console.log('Medicine Logs:', result);
  return result;
};

export const getLatestMedicineLog = () => {
  const db = getDb();
  const result = db.getFirstSync(
    `SELECT * FROM MedicineLogs ORDER BY timestamp DESC LIMIT 1`
  );
  console.log('Latest Medicine Log:', result);
  return result;
};

