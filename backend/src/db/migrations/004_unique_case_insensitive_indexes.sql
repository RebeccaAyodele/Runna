-- Drop non-unique indexes if they exist
DROP INDEX IF EXISTS idx_users_email_lower;
DROP INDEX IF EXISTS idx_users_matric_lower;

-- Create UNIQUE expression indexes for case-insensitive uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_matric_lower ON users (LOWER(matric_number));
