# Tripvacay BE

# Getting Started

## Server Requirements

- Node.js 20.12.1
- PostgreSQL 14
- Redis latest

## Installing preparation

1. Default Application $BASEPATH : `/home/app.user/tripvacay_be`

2. Copy the .env file from .env.example under $BASEPATH, fill your config in .env file instead of example config

# I. Build the app (manual)

## 1. Prerequisite

In the root folder, create the .env file and change the following values

```bash
  APP_ENVIRONMENT=
  APP_PORT=
  
  DB_CONNECTION=
  DB_HOST=
  DB_PORT=
  DB_USERNAME=
  DB_PASSWORD=
```

## 2. Dependencies Installation

```bash
  yarn install
```

## 3. Migrate database

### 3.1. Build the app
```bash
  yarn build
```

### 3.2. Migrate
```bash
  yarn migrate:run
```

### 3.3. Revert Migration
```bash
  yarn migrate:revert
```

## 4. Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

# II. Build with Docker

## 1. Prerequisite

In the root folder, find the .env file and change the following values

```bash
  APP_ENVIRONMENT=local
  APP_PORT=3000
  
  DB_CONNECTION=postgres
  DB_HOST=tripvacay_db
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=[your_password]
  DB_DATABASE=[your_database]
```

## 2. Setup docker

```bash
  make setup
```

```bash
  make up
```

## 3. Migrate database

## 3.1. Migrate

### 3.1.1 Create migration file
```bash
  make migrationCreate n=[your_migration_name]
```

### 3.1.2 Migrate
```bash
  make buildNest
  make migrate
```

## 3.2. Revert Migration

```bash
  make migrationRevert
```

## 4. Run dev mode

```bash
  make dev
```

## 5. Other

### 5.1. Run seed

```bash
  make seedRun
```

### 5.2. Local url

http://localhost:30060

### 5.3 Sync entities
```bash
  make syncEntities
```

