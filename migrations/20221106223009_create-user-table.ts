import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // enable us to use uuid_generate_v4();
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // create table
  await knex.raw(`
    CREATE TABLE users (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
      email text UNIQUE NOT NULL,
      first_name text,
      last_name text,
      created_at timestamptz NOT NULL DEFAULT NOW(),
      updated_at timestamptz NOT NULL DEFAULT NOW()
    );
  `);

  // create indexes
  await knex.raw(`CREATE INDEX idx_users_email ON users USING BTREE(email);`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE users;`);
}
