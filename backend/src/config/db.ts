// TODO: Change SSL authorization to true doing production

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    throw new Error('FATAL: DATABASE_URL is not set in process.env! Please check your backend/.env file.');
}

const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : {
            rejectUnauthorized: isProduction,
        }
});

pool.on('connect', () => {
    console.log('Connected to NeonDB');
});

pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
});

