import { pool } from "../config/db.js";
import {
    TaskDto,
    DbTaskRow,
    CreateTaskInput,
    TaskStatus
} from "../types/index.js";

export const formatTask = (row: DbTaskRow): TaskDto => {
    const fee = Number(row.fee || 0);
    const transport = 0;
    const normalizedStatus = (row.status || 'open').toLowerCase() as TaskStatus;

    return {
        id: row.id,
        title: row.title,
        description: row.description,
        proofRequirement: row.proof_requirement || '',
        status: normalizedStatus,
        taskPrice: fee,
        transportEstimate: transport,
        totalPrice: fee + transport,
        locationName: row.location || '',
        distanceMeters: null,
        deadlineAt: row.deadline_at ? new Date(row.deadline_at).toISOString() : null,
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
        claimedAt: row.claimed_at ? new Date(row.claimed_at).toISOString() : null,
        completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
        confirmedAt: row.confirmed_at ? new Date(row.confirmed_at).toISOString() : null,
        proofPhotoUrl: row.proof_image_url || null,
        poster: {
            id: row.poster_id,
            fullName: row.poster_name || 'Campus Student',
            avatarUrl: row.poster_avatar || null,
            avgRating: null,
            trustTier: 'new'
        },
        doer: row.runner_id ? {
            id: row.runner_id,
            fullName: row.runner_name || 'Runner',
            avatarUrl: row.runner_avatar || null,
            avgRating: null,
            trustTier: 'new'
        } : null
    };
};

export const createTask = async (data: CreateTaskInput): Promise<DbTaskRow> => {
    const query = `
        INSERT INTO tasks (title, description, proof_requirement, location, fee, poster_id, deadline_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        data.title.trim(),
        data.description.trim(),
        data.proofRequirement?.trim() || '',
        data.location.trim(),
        data.fee,
        data.posterId,
        data.deadlineAt || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getOpenTasks = async (limit: number = 20): Promise<TaskDto[]> => {
    const query = `
        SELECT t.*, u.full_name as poster_name, u.avatar_url as poster_avatar
        FROM tasks t
        JOIN users u ON t.poster_id = u.id
        WHERE LOWER(t.status) = 'open'
        ORDER BY t.created_at DESC
        LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);
    return result.rows.map(formatTask);
};

export const findTaskById = async (id: string): Promise<TaskDto | null> => {
    const query = `
        SELECT t.*, u.full_name as poster_name, u.avatar_url as poster_avatar
        FROM tasks t
        JOIN users u ON t.poster_id = u.id
        WHERE t.id = $1
        LIMIT 1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] ? formatTask(result.rows[0]) : null;
};

export const claimTask = async (taskId: string, runnerId: string): Promise<TaskDto | null> => {
    const query = `
        UPDATE tasks
        SET status = 'claimed', runner_id = $2, updated_at = NOW()
        WHERE id = $1 AND LOWER(status) = 'open'
        RETURNING *;
    `;
    const result = await pool.query(query, [taskId, runnerId]);
    return result.rows[0] ? formatTask(result.rows[0]) : null;
};