# Dockerize Backend Services Design

## Purpose
Containerize the entire Backend stack (MySQL, Redis, Kafka, Spring Boot App, and NGINX) using Docker Compose so that it can be deployed with a single command (`docker-compose up -d`).

## Architecture

The system will consist of 5 services communicating within a custom Docker bridge network (`backend-net`).

### 1. MySQL (Database)
- Image: `mysql:8.0`
- Container Name: `mysql-db`
- Ports: `3306:3306`
- Config: Auto-create `laptopshop` database.
- Healthcheck: Check if `mysqladmin ping` succeeds.

### 2. Redis (Cache)
- Image: `redis:7-alpine`
- Container Name: `redis-cache`
- Ports: `8386:6379` (Mapped to 8386 on host to match application-dev.properties, or internally accessible as `redis:6379`). We will use internal port `6379` and map the host port to `8386`.
- Healthcheck: Check if `redis-cli ping` succeeds.

### 3. Kafka (Event Streaming)
- Image: `apache/kafka:4.3.0`
- Container Name: `ecommerce-kafka`
- Mode: KRaft mode (No Zookeeper required).
- Ports: `9092:9092`
- Healthcheck: Check if port 9092 is responding.

### 4. App (Spring Boot Backend)
- Dockerfile: Multi-stage build (Maven build -> JRE 21 run).
- Container Name: `springboot-app`
- Profile: Use a new profile `docker` or override environment variables to connect to internal docker hostnames (`mysql`, `redis`, `kafka`).
- Exposes: 8080 (Internally)
- Dependencies: Waits for MySQL, Redis, and Kafka to be healthy.

### 5. NGINX (Reverse Proxy)
- Image: `nginx:alpine`
- Container Name: `nginx-proxy`
- Ports: `80:80`
- Config: Custom `nginx.conf` that proxies `/api` and other traffic to `http://app:8080`.
- Dependencies: Waits for App to start.

## Data Flow
Client -> `http://localhost:80` (NGINX) -> `http://app:8080` (Spring Boot).
Spring Boot internally connects to `mysql:3306`, `redis:6379`, and `kafka:9092`.

## Volumes
To persist data across container restarts:
- `mysql_data`: Maps to `/var/lib/mysql`
- `redis_data`: Maps to `/data`
- `kafka_data`: Maps to `/var/lib/kafka/data`

## Environment Configuration
Instead of creating a new properties file, we will pass environment variables in `docker-compose.yml` to override the application properties for Docker environment:
- `SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/laptopshop`
- `SPRING_DATA_REDIS_HOST=redis`
- `SPRING_DATA_REDIS_PORT=6379`
- `SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092`