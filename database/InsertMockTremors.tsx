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
      const frequency = parseFloat((20 + Math.random() * 10).toFixed(2)); // 20–30 Hz
      const amplitude = parseFloat((0.5 + Math.random()).toFixed(2));     // 0.5–1.5
      const journal = `Auto log ${i}`;
      const medId = medicineLogIds[i % medicineLogIds.length]; // cycle through 9

      db.runSync(
        `INSERT INTO TremorLogs (timestamp, frequency, amplitude, journal, medicine_log_id) VALUES (?, ?, ?, ?, ?)`,
        [timestamp, frequency, amplitude, journal, medId]
      );
    }

    console.log('✅ Inserted 9 medicine logs and 100 tremor logs');
  } catch (err) {
    console.error('❌ Failed to insert mock data:', err);
  }
};
