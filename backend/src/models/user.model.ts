import { pool } from "../config/db.js";

export interface User {
    id: string;
    full_name: string;
    email: string;
    matric_number: string;
    phone: string;
    password_hash: string;
    is_verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserInput {
    fullName: string;
    email: string;
    matricNumber: string;
    phone: string;
    passwordHash: string;
}

export const findUserByEmailOrMatric = async (email: string, matric_number: string): Promise<User | null> => {
    const query = `
        SELECT * FROM users
        WHERE email = $1 OR matric_number = $2
        LIMIT 1
    `;
    const result = await pool.query(query, [email.toLowerCase().trim(), matric_number.trim()]);
    return result.rows[0] || null;
}

export const createUser = async (data: CreateUserInput): Promise<Omit<User, 'password_hash'>> => {
    const query = `
        INSERT INTO users (full_name, email, matric_number, phone, password_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, full_name, email, matric_number, phone, is_verified, created_at, updated_at;
    `;

    const values = [
        data.fullName.trim(),
        data.email.toLowerCase().trim(),
        data.matricNumber.trim(),
        data.phone.trim(),
        data.passwordHash
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
}

// Login
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const query = `
        SELECT * FROM users
        WHERE email = $1
        LIMIT 1;
    `;
    const result = await pool.query(query, [email.toLowerCase().trim()]);
    return result.rows[0] || null;
}

// Verify user before posting a task
export const findUserById = async (id: string): Promise<Omit<User, 'password_hash'> | null> => {
    const query = `
        SELECT id, full_name, email, matric_number, phone, is_verified, created_at, updated_at
        FROM users
        WHERE id = $1
        LIMIT 1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
}