#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER api PASSWORD 'api';
    CREATE DATABASE currency_trader;
    GRANT ALL PRIVILEGES ON DATABASE currency_trader TO api;
EOSQL
