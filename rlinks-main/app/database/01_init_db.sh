#!/bin/bash
set -e  # Ensure the script stops at the first error
set -x  # Debug mode for verbosity

# Create the backend database and role
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE $BACKEND_DB;
    CREATE ROLE $BACKEND_USER WITH LOGIN PASSWORD '$BACKEND_PASSWORD' SUPERUSER CREATEDB CREATEROLE INHERIT;
    GRANT ALL PRIVILEGES ON DATABASE $BACKEND_DB TO $BACKEND_USER;
EOSQL

psql -d $BACKEND_DB -v ON_ERROR_STOP=1 -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"