import { getDb } from './db-service'; // adjust path if needed

export const insertMockTremorLogs = () => {
  const db = getDb();
  const now = new Date();

  const medicineNames = ['Levodopa', 'Amantadine', 'Pramipexole'];
  const dosages = ['50mg', '100mg', '200mg'];
  const medicineLogIds: number[] = [];

  try {
    // Insert 9 medicine logs (3 meds × 3 dosages)
    for (const med of medicineNames) {
      for (const dose of dosages) {
        const timestamp = new Date().toISOString();
        db.runSync(
          `INSERT INTO MedicineLogs (timestamp, medication, dosage) VALUES (?, ?, ?)`,
          [timestamp, med, dose]
        );

        // Get the last inserted row ID
        const result = db.getFirstSync(`SELECT last_insert_rowid() AS id`);
        medicineLogIds.push(result.id);
      }
    }

    // Insert 100 tremor logs and assign medicine_log_id cyclically
    for (let i = 0; i < 100; i++) {
        const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString(); // 1 day apart
        const frequency = parseFloat((4 + Math.random() * 8).toFixed(2));
        const intensity = parseFloat((Math.random() * 100).toFixed(2));  
        const journal = `Auto log ${i}`;
        const medId = medicineLogIds[i % medicineLogIds.length];
      
        db.runSync(
          `INSERT INTO TremorLogs (timestamp, frequency, intensity, journal, medicine_log_id) VALUES (?, ?, ?, ?, ?)`,
          [timestamp, frequency, intensity, journal, medId]
        );
      }
      

    console.log('✅ Inserted 9 medicine logs and 100 tremor logs');
  } catch (err) {
    console.error('❌ Failed to insert mock data:', err);
  }
};
