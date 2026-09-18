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
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: isLocal
        ? false
        : {
            rejectUnauthorized: false,
        }
});

pool.on('connect', () => {
    console.log('Connected to NeonDB');
});

pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
});