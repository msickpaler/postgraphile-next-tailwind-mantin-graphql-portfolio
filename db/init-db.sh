#!/bin/bash
set -e

#Command for running SQL statements on POSTGRES instance
POSTGRES="psql -v ON_ERROR_STOP=1 --username ${POSTGRES_USER} --dbname ${POSTGRES_DB}"

#Running the Scripts Goes Under Here
for script in /scripts/*.sql;do
    echo ${script};
    $POSTGRES --echo-all -f ${script};
done

#Removing Default permissions on public for security purposes
$POSTGRES <<EOSQL
    REVOKE ALL PRIVILEGES ON DATABASE postgres FROM PUBLIC;
    REVOKE CONNECT ON DATABASE $POSTGRES_DB FROM PUBLIC;
    REVOKE CREATE ON DATABASE $POSTGRES_DB FROM PUBLIC;
    REVOKE CREATE ON SCHEMA PUBLIC FROM PUBLIC;
    REVOKE USAGE ON SCHEMA PUBLIC FROM PUBLIC;
    REVOKE USAGE ON SCHEMA "$DB_DEFAULT_SCHEMA" FROM PUBLIC;
    REVOKE CREATE ON SCHEMA "$DB_DEFAULT_SCHEMA" FROM PUBLIC;
EOSQL

#Creating WRITE user for SCHEMA $DB_DEFAULT_SCHEMA
$POSTGRES <<EOSQL
    CREATE USER "$DB_WRITE_USER";
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO "$DB_WRITE_USER";
    GRANT CREATE, USAGE ON SCHEMA "$DB_DEFAULT_SCHEMA" TO "$DB_WRITE_USER";
    GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA "$DB_DEFAULT_SCHEMA" TO "$DB_WRITE_USER";
    ALTER USER "$DB_WRITE_USER" WITH PASSWORD '$DB_WRITE_PASS';
    ALTER ROLE "$DB_WRITE_USER" SET search_path TO "$DB_DEFAULT_SCHEMA";
EOSQL

#Creating READONLY user for SCHEMA $DB_DEFAULT_SCHEMA
$POSTGRES <<EOSQL
    CREATE USER "$DB_READONLY_USER";
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO "$DB_READONLY_USER";
    GRANT USAGE ON SCHEMA "$DB_DEFAULT_SCHEMA" TO "$DB_READONLY_USER";
    GRANT SELECT ON ALL TABLES IN SCHEMA "$DB_DEFAULT_SCHEMA" TO "$DB_READONLY_USER";
    ALTER USER "$DB_READONLY_USER" WITH PASSWORD '$DB_READONLY_PASS';
    ALTER ROLE "$DB_READONLY_USER" SET search_path TO "$DB_DEFAULT_SCHEMA";
EOSQL
