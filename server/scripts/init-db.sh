#!/bin/bash

# Initialize database with schema

echo "Initializing database..."

# Wait for database to be ready
until PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c '\q'; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - executing schema"

# Execute schema
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /app/src/database/schema.sql

echo "Database initialized successfully"
