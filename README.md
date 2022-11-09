## Description

Tailored starter template for building out APIs with feathers v4 as the underlying framework.
Inclides: Postgres database, nyc + mocha + chai + sinon testing, Typebox + Knex

## Setup

- Ensure you've installed the [Node Modules](##Installation)
- Ensure you've installed the [Requirements](##Requirements)
- Ensure you've completed the steps in [Database](##Database)
- Ensure you've completed configuration [Configuration](##Configuration)

## Installation

```bash
$ npm install
```

## Configuration

Configuration is accomplished via editing the files in the `configuration/` directory. More details about how this works can be found at [node-config](https://github.com/node-config/node-config#readme);

## Database

This app utilizes a Postgres database. You'll need to run one for localhost development. My preferred method is via Docker.

While this isn't the most user friendly method, this is the way i've setup my machine and it'll do for now. In the future it may make more sense to incorporate these scripts directly into this repo.

You can emulate my setup by exporting the following aliases in your shell (`.zshrc` or equivalent):

```bash
alias lpg-env=". ~/path/to/scripts/lpg-env.sh"
alias lpg-up=". ~/path/to/scripts/lpg-up.sh"
alias lpg-down=". ~/path/to/scripts/lpg-down.sh"
```

And creating the following scripts (with some edits) in a directory (`~/path/to/scripts`):

`lpg-env.sh`

```bash
export PGHOST="localhost"
export PGPORT=5432
export PGUSER="postgres"
export PGPASSWORD="pass"
```

`lpg-up.sh`

```bash
# Boot up Dockerized Postgres for localhost dev
docker run --name localhost-postgres \
-p 5432:5432 \
-e POSTGRES_PASSWORD=pass \
-e PGDATA=/var/lib/postgresql/data/pgdata \
-v /path/to/where/you/want/to/persist/data:/var/lib/postgresql/data \
-d postgres
```

`lpg-down.sh`

```bash
docker stop localhost-postgres && docker rm localhost-postgres
```

Finally, you can use the following scripts from `package.json` now:

```bash
# boot up database
$ npm run db:up

# tear down database
$ npm run db:down

# create database tables
$ npm run db:create
```

## Database Migrations

```bash
# Create a new database migration
$ npm run db:migrate:make <name>

# Migrate to latest change
$ npm run db:migrate:latest

# Rollback latest migration
$ npm run db:migrate:rollback

# To execute against different environments, prefix with NODE_ENV=<env>
$ NODE_ENV=test npm run db:migrate:latest
```

## Running the app

```bash
# booting up database
$ npm run db:up

# standard
$ npm start

# dev mode
$ npm run start:dev
```

## Test

```bash
# tests
$ npm test

# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e
```

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```bash
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Requirements

- Postgres v14.5
  - `brew install postgresql`
- Docker Desktop v4.10.1
  - [Docker Desktop Download](https://www.docker.com/products/docker-desktop/)
