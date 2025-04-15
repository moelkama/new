FROM postgres

COPY ./01_init_db.sh /docker-entrypoint-initdb.d/
COPY ./02_check_db.sh /docker-entrypoint-initdb.d/


RUN chmod +x /docker-entrypoint-initdb.d/01_init_db.sh
RUN chmod +x /docker-entrypoint-initdb.d/02_check_db.sh