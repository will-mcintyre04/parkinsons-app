import { getDb } from './db-service'; // adjust the import path accordingly

export const insertMockTremorLogs = () => {
  const db = getDb();
  const now = new Date();

  try {
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now.getTime() - i * 6 * 60 * 60 * 1000).toISOString(); // every 6 hours
      const frequency = parseFloat((20 + Math.random() * 10).toFixed(2)); // 20–30 Hz
      const amplitude = parseFloat((0.5 + Math.random()).toFixed(2)); // 0.5–1.5
      const journal = `Auto log ${i}`;

      db.runSync(
        `INSERT INTO TremorLogs (timestamp, frequency, amplitude, journal) VALUES (?, ?, ?, ?)`,
        [timestamp, frequency, amplitude, journal]
      );
    }

    console.log('✅ Inserted 30 mock tremor logs');
  } catch (err) {
    console.error('❌ Failed to insert mock tremor logs:', err);
  }
};
