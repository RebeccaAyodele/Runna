import { pool } from "../config/db.js";

export interface Task {
    id: string;
    title: string;
    description: string;
    location: string;
    fee: number;
    status: 'OPEN' | 'CLAIMED' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CONFIRMED' | 'DISPUTED';
    poster_id: string;
    runner_id: string | null;
    proof_image_url: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTaskInput {
    title: string;
    description: string;
    location: string;
    fee: number;
    posterId: string;
}

export const createTask = async (data: CreateTaskInput): Promise<Task> => {
    const query = `
        INSERT INTO tasks (title, description, location, fee, poster_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [data.title, data.description, data.location, data.fee, data.posterId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getOpenTasks = async (): Promise<Task[]> => {
    const query = `
        SELECT t.*, u.full_name as poster_name, u.phone as poster_phone
        FROM tasks t
        JOIN users u ON t.poster_id = u.id
        WHERE t.status = 'OPEN'
        ORDER BY t.created_at DESC;
    `;

    const result = await pool.query(query)
    return result.rows;
}

export const findTaskById = async (id: string): Promise<Task | null> => {
    const query = `
        SELECT t.*, u.full_name as poster_name, u.phone as poster_phone
        FROM tasks t
        JOIN users u ON t.poster_id = u.id
        WHERE t.id = $1
        LIMIT 1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
}

export const claimTask = async (taskId: string, runnerId: string): Promise<Task | null> => {
    const query = `
        UPDATE tasks
        SET status = 'CLAIMED', runner_id = $2, updated_at = NOW()
        WHERE id = $1 AND status = 'OPEN'
        RETURNING *;
    `;
    const result = await pool.query(query, [taskId, runnerId]);
    return result.rows[0] || null;
};