-- Initialize tenant databases
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create Misrut database
CREATE DATABASE misrut_db;

GRANT ALL PRIVILEGES ON DATABASE misrut_db TO payload;

-- Create Synrgy database
CREATE DATABASE synrgy_db;

GRANT ALL PRIVILEGES ON DATABASE synrgy_db TO payload;

-- Connect to each database and set up extensions (if needed)
\c misrut_db;
-- Add any extensions here, e.g.:
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c synrgy_db;
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log completion
\echo 'Tenant databases created successfully!'
\echo 'Misrut: misrut_db'
\echo 'Synrgy: synrgy_db'