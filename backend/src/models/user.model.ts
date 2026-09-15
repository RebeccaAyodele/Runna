import { pool } from "../config/db.js";
import { DbUserRow, CreateUserInput } from "../types/index.js";

export const findUserByEmailOrMatric = async (email: string, matric_number: string): Promise<DbUserRow | null> => {
    const query = `
        SELECT * FROM users
        WHERE LOWER(email) = LOWER($1) OR LOWER(matric_number) = LOWER($2)
        LIMIT 1
    `;
    const result = await pool.query(query, [email.toLowerCase().trim(), matric_number.trim()]);
    return result.rows[0] || null;
};

export const createUser = async (data: CreateUserInput): Promise<Omit<DbUserRow, 'password_hash'>> => {
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
        RETURNING id, full_name, email, matric_number, phone, is_verified, verification_code, verification_code_expires_at, avatar_url, created_at, updated_at;
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
};

export const findUserByEmail = async (email: string): Promise<DbUserRow | null> => {
    const query = `
        SELECT * FROM users
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1;
    `;
    const result = await pool.query(query, [email.toLowerCase().trim()]);
    return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<Omit<DbUserRow, 'password_hash'> | null> => {
    const query = `
        SELECT id, full_name, email, matric_number, phone, is_verified, avatar_url, created_at, updated_at
        FROM users
        WHERE id = $1
        LIMIT 1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};