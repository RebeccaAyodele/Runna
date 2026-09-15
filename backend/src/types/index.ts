

export type TrustTier = 'new' | 'established' | 'trusted';

export interface UserSummary {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    avgRating: number | null;
    trustTier: TrustTier;
}

export interface UserDto {
    id: string;
    fullName: string;
    email: string;
    schoolEmail: string;
    matricNumber: string;
    phone: string | null;
    isVerified: boolean;
    trustTier: TrustTier;
    avgRating: number | null;
    avatarUrl: string | null;
    createdAt: Date | string;
}

export interface PublicUserDto {
    id: string;
    fullName: string;
    matricNumber: string;
    trustTier: TrustTier;
    avgRating: number | null;
    avatarUrl: string | null;
    createdAt: Date | string;
}

export interface DbUserRow {
    id: string;
    full_name: string;
    email: string;
    matric_number: string;
    phone: string | null;
    password_hash: string;
    is_verified: boolean;
    verification_code?: string | null;
    verification_code_expires_at?: Date | null;
    avatar_url: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserInput {
    fullName: string;
    email: string;
    matricNumber: string;
    phone?: string | null;
    passwordHash: string;
    verificationCode?: string | null;
    verificationCodeExpiresAt?: Date | null;
}


export type TaskStatus =
    | 'open'
    | 'claimed'
    | 'in_progress'
    | 'completed'
    | 'confirmed'
    | 'expired'
    | 'missed_deadline'
    | 'disputed';

export interface TaskDto {
    id: string;
    title: string;
    description: string;
    proofRequirement: string;
    status: TaskStatus;
    taskPrice: number;
    transportEstimate: number;
    totalPrice: number;
    locationName: string;
    distanceMeters: number | null;
    deadlineAt: string | null;
    createdAt: string;
    claimedAt: string | null;
    completedAt: string | null;
    confirmedAt: string | null;
    proofPhotoUrl: string | null;
    poster: UserSummary;
    doer: UserSummary | null;
}

export interface DbTaskRow {
    id: string;
    title: string;
    description: string;
    proof_requirement: string | null;
    location: string;
    fee: string | number;
    status: string;
    poster_id: string;
    runner_id: string | null;
    proof_image_url: string | null;
    deadline_at: Date | string | null;
    created_at: Date | string;
    updated_at: Date | string;
    claimed_at?: Date | string | null;
    completed_at?: Date | string | null;
    confirmed_at?: Date | string | null;
    poster_name?: string | null;
    poster_avatar?: string | null;
    runner_name?: string | null;
    runner_avatar?: string | null;
}

export interface CreateTaskInput {
    title: string;
    description: string;
    proofRequirement?: string;
    location: string;
    fee: number;
    posterId: string;
    deadlineAt?: string | null;
}


export interface ApiErrorResponse {
    error: {
        message: string;
        code?: string;
        fields?: Record<string, string>;
    };
}
