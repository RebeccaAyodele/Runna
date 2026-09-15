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

export interface GetTasksOptions {
    limit?: number;
    search?: string;
    cursor?: string;
}

export const getOpenTasks = async (options: GetTasksOptions = {}): Promise<{ tasks: TaskDto[]; nextCursor: string | null }> => {
    const limit = options.limit || 20;
    const values: any[] = [];
    let paramIndex = 1;

    let query = `
        SELECT t.*, 
               u.full_name as poster_name, u.avatar_url as poster_avatar,
               r.full_name as runner_name, r.avatar_url as runner_avatar
        FROM tasks t
        JOIN users u ON t.poster_id = u.id
        LEFT JOIN users r ON t.runner_id = r.id
        WHERE LOWER(t.status) = 'open'
          AND (t.deadline_at IS NULL OR t.deadline_at > NOW())
    `;

    if (options.search && options.search.trim()) {
        query += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex} OR t.location ILIKE $${paramIndex})`;
        values.push(`%${options.search.trim()}%`);
        paramIndex++;
    }

    if (options.cursor) {
        query += ` AND t.created_at < $${paramIndex}`;
        values.push(options.cursor);
        paramIndex++;
    }

    query += ` ORDER BY t.created_at DESC LIMIT $${paramIndex}`;
    values.push(limit + 1); // fetch 1 extra to determine nextCursor

    const result = await pool.query(query, values);
    const hasMore = result.rows.length > limit;
    const rows = hasMore ? result.rows.slice(0, limit) : result.rows;
    const tasks = rows.map(formatTask);

    const nextCursor = hasMore && rows.length > 0
        ? new Date(rows[rows.length - 1].created_at).toISOString()
        : null;

    return { tasks, nextCursor };
};

export const findTaskById = async (id: string): Promise<TaskDto | null> => {
    const query = `
        SELECT t.*, 
               u.full_name as poster_name, u.avatar_url as poster_avatar,
               r.full_name as runner_name, r.avatar_url as runner_avatar
        FROM tasks t
        JOIN users u ON t.poster_id = u.id
        LEFT JOIN users r ON t.runner_id = r.id
        WHERE t.id = $1
        LIMIT 1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] ? formatTask(result.rows[0]) : null;
};

export const claimTask = async (taskId: string, runnerId: string): Promise<TaskDto | null> => {
    const query = `
        UPDATE tasks
        SET status = 'claimed', runner_id = $2, claimed_at = NOW(), updated_at = NOW()
        WHERE id = $1 
          AND LOWER(status) = 'open'
          AND (deadline_at IS NULL OR deadline_at > NOW())
        RETURNING id;
    `;
    const result = await pool.query(query, [taskId, runnerId]);
    if (!result.rows[0]) return null;
    return await findTaskById(taskId);
};

export const getTasksByPoster = async (posterId: string, limit: number = 20): Promise<TaskDto[]> => {
    const query = `
        SELECT t.*, 
               u.full_name as poster_name, u.avatar_url as poster_avatar,
               r.full_name as runner_name, r.avatar_url as runner_avatar
        FROM tasks t
        JOIN users u ON t.poster_id = u.id
        LEFT JOIN users r ON t.runner_id = r.id
        WHERE t.poster_id = $1
        ORDER BY t.created_at DESC
        LIMIT $2;
    `;
    const result = await pool.query(query, [posterId, limit]);
    return result.rows.map(formatTask);
};

export const getCompletedTasksByRunner = async (runnerId: string, limit: number = 20): Promise<TaskDto[]> => {
    const query = `
        SELECT t.*, 
               u.full_name as poster_name, u.avatar_url as poster_avatar,
               r.full_name as runner_name, r.avatar_url as runner_avatar
        FROM tasks t
        JOIN users u ON t.poster_id = u.id
        LEFT JOIN users r ON t.runner_id = r.id
        WHERE t.runner_id = $1 AND LOWER(t.status) IN ('completed', 'confirmed')
        ORDER BY t.updated_at DESC
        LIMIT $2;
    `;
    const result = await pool.query(query, [runnerId, limit]);
    return result.rows.map(formatTask);
};
