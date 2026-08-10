# Dockerize BE Services Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Containerize the backend services (MySQL, Redis, Kafka, Spring Boot App, NGINX) using Docker Compose for a single-command deployment.

**Architecture:** A multi-container Docker application using a custom bridge network `backend-net`. NGINX proxies traffic to the Spring Boot App, which connects to MySQL, Redis, and Kafka (KRaft mode). The Spring Boot app overrides properties using environment variables in the Compose file.

**Tech Stack:** Docker, Docker Compose, NGINX, Spring Boot (Java 21), MySQL 8.0, Redis 7 (Alpine), Apache Kafka 4.3.0.

## Global Constraints
- Use multi-stage Docker build for the Spring Boot application (Maven build -> JRE 21 run).
- Kafka must run in KRaft mode (no Zookeeper).
- All data must persist using named volumes (`mysql_data`, `redis_data`, `kafka_data`).
- Single command deployment: `docker compose up -d` (we will use `docker-compose.yml` at the project root).
- Use environment variables to override DB/Redis/Kafka configuration instead of a new `.properties` profile.

---

### Task 1: Update Application Dockerfile and Configure NGINX Reverse Proxy

**Files:**
- Modify: `Dockerfile`
- Create: `nginx.conf`

**Interfaces:**
- Consumes: Existing Spring Boot `application-dev.properties` (base properties).
- Produces: A Dockerfile ready for compose and an `nginx.conf` that proxies to `http://app:8080`.

- [ ] **Step 1: Check existing Dockerfile**
```bash
cat Dockerfile
```

- [ ] **Step 2: Update/Verify Dockerfile for Spring Boot**
Modify `Dockerfile` to ensure it uses `maven:3.9.9-eclipse-temurin-21` and `eclipse-temurin:21-jre`. Ensure it copies `pom.xml` and `src` correctly.
```dockerfile
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build avoiding test failures if any
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

- [ ] **Step 3: Create NGINX Configuration**
Create `nginx.conf` at the root folder to reverse proxy to the `app` service on port 8080.
```nginx
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;

        location / {
            proxy_pass http://app:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

- [ ] **Step 4: Verify files exist and have correct content**
```bash
ls -la nginx.conf Dockerfile
```

- [ ] **Step 5: Commit changes**
```bash
git add Dockerfile nginx.conf
git commit -m "build: update Dockerfile and add nginx.conf"
```

---

### Task 2: Create complete docker-compose.yml

**Files:**
- Modify: `docker-compose.yml`

**Interfaces:**
- Consumes: The `Dockerfile` and `nginx.conf` created in Task 1.
- Produces: The final `docker-compose.yml` to orchestrate `mysql`, `redis`, `kafka`, `app`, and `nginx`.

- [ ] **Step 1: Define Network and Volumes**
Open `docker-compose.yml` and set up the foundation.
```yaml
networks:
  backend-net:
    driver: bridge

volumes:
  mysql_data:
  redis_data:
  kafka_data:
```

- [ ] **Step 2: Define Infrastructure Services (MySQL, Redis, Kafka)**
In `docker-compose.yml` under `services:`
```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 06102005
      MYSQL_DATABASE: laptopshop
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - backend-net
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost", "-u", "root", "-p06102005"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: redis-cache
    restart: always
    command: redis-server --requirepass 06102005
    ports:
      - "8386:6379"
    volumes:
      - redis_data:/data
    networks:
      - backend-net
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "06102005", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  kafka:
    image: apache/kafka:4.3.0
    container_name: ecommerce-kafka
    restart: always
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    ports:
      - "9092:9092"
    volumes:
      - kafka_data:/var/lib/kafka/data
    networks:
      - backend-net
    healthcheck:
      test: ["CMD", "kafka-topics.sh", "--bootstrap-server", "localhost:9092", "--list"]
      interval: 15s
      timeout: 5s
      retries: 5
```

- [ ] **Step 3: Define Application and NGINX Services**
Append `app` and `nginx` to `docker-compose.yml` under `services:`
```yaml
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: springboot-app
    restart: always
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
      kafka:
        condition: service_healthy
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/laptopshop
      - SPRING_DATA_REDIS_HOST=redis
      - SPRING_DATA_REDIS_PORT=6379
      - SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092
    networks:
      - backend-net

  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: always
    depends_on:
      - app
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - backend-net
```

- [ ] **Step 4: Verify Docker Compose syntax**
```bash
docker-compose config -q
```
Expected: No output means configuration syntax is correct.

- [ ] **Step 5: Commit changes**
```bash
git add docker-compose.yml
git commit -m "build: define multi-container setup in docker-compose.yml"
```
