FROM postgres

RUN mkdir -p '/docker-entrypoint-initdb.d'

COPY scripts/* scripts/
COPY init-db.sh /docker-entrypoint-initdb.d/init-db.sh
