#!/bin/bash
set -e

# List of required databases
REQUIRED_DATABASES=($BACKEND_DB $DB_NAME $RPS_DB)

# Check each database
for db in "${REQUIRED_DATABASES[@]}"; do
  if ! psql -U $POSTGRES_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$db';" | grep -q 1; then
    echo "Database $db is not ready."
    exit 1
  fi
done

echo "All required databases are ready."
exit 0