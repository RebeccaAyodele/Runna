import { pool } from "../config/db.js";

export interface User {
    id: string;
    full_name: string;
    email: string;
    matric_number: string;
    phone: string | null;
    password_hash: string;
    is_verified: boolean;
    verification_code: string | null;
    verification_code_expires_at: Date | null;
    avatar_url: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserInput {
    fullName: string;
    email: string;
    matricNumber: string;
    phone: string | null;
    passwordHash: string;
    verificationCode?: string | null;
    verificationCodeExpiresAt?: Date | null;
}

export const findUserByEmailOrMatric = async (email: string, matric_number: string): Promise<User | null> => {
    const query = `
        SELECT * FROM users
        WHERE LOWER(email) = LOWER($1) OR LOWER(matric_number) = LOWER($2)
        LIMIT 1
    `;
    const result = await pool.query(query, [email.toLowerCase().trim(), matric_number.trim()]);
    return result.rows[0] || null;
}

export const createUser = async (data: CreateUserInput): Promise<Omit<User, 'password_hash'>> => {
    const query = `
        INSERT INTO users (
            full_name, 
            email, 
            matric_number, 
            phone, 
            password_hash, 
            verification_code, 
            verification_code_expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        data.fullName.trim(),
        data.email.toLowerCase().trim(),
        data.matricNumber.trim(),
        data.phone ? data.phone.trim() : null,
        data.passwordHash,
        data.verificationCode || null,
        data.verificationCodeExpiresAt || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
}

// Login
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const query = `
        SELECT * FROM users
        WHERE LOWER(email) = LOWER($1)
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