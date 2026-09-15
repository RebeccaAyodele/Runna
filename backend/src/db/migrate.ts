import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    console.log('Running database migrations...');
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        const { rows } = await client.query('SELECT filename FROM _migrations');
        const executedSet = new Set(rows.map((r: { filename: string }) => r.filename));

        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        let appliedCount = 0;

        for (const file of files) {
            if (executedSet.has(file)) {
                console.log(`Skipping already executed migration: ${file}`);
                continue;
            }

            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf-8');

            console.log(`Executing migration: ${file}`);
            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
                await client.query('COMMIT');
                appliedCount++;
            } catch (migrationErr) {
                await client.query('ROLLBACK');
                throw migrationErr;
            }
        }

        if (appliedCount === 0) {
            console.log('Database is up to date. No pending migrations.');
        } else {
            console.log(`Successfully applied ${appliedCount} migration(s)!`);
        }
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});