FROM python:3.12.3-slim

ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y postgresql-client

RUN groupadd -g 1000 appgroup && \
    useradd -m -u 1000 -g 1000 appuser

RUN mkdir /app && chown -R appuser:appgroup /app

WORKDIR /app

EXPOSE 9000

COPY --chown=appuser:appgroup . /app

RUN pip install -r requirements.txt

RUN chmod +x backend.sh

USER appuser

CMD ["./backend.sh"]
