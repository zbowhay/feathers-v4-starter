// https://github.com/node-config/node-config/wiki/Configuration-Files
import config from 'config';

// see ./config/*.json files
const postgres = config.get<{ [key: string]: string }>('postgres');

module.exports = {
  client: postgres.client,
  connection: postgres.connection,
  migrations: {
    extension: 'ts',
    stub: './migrations/migration.stub',
  },
};
