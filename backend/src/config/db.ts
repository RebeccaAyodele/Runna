// TODO: Change SSL authorization to true doing production

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in process.env! Check your backend/.env file.');
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('Connected to NeonDB');
});

pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('NeonDB connection error:', err.message);
    } else {
        console.log('Connected to NeonDB successfully at:', res.rows[0].now);
    }
});
