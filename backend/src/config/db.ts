import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    throw new Error('FATAL: DATABASE_URL is not set in process.env! Please check your backend/.env file.');
}

const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal
        ? false
        : {
            rejectUnauthorized: true,
        }
});

pool.on('connect', () => {
    console.log('Connected to NeonDB');
});

pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
});