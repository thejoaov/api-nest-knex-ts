/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv').config().parsed;
const path = require('path');
const fs = require('fs');

let migrationFolder = path.join(__dirname, 'src', 'modules', 'database', 'migrations');

if (!fs.existsSync(migrationFolder)) {
  migrationFolder = path.join(__dirname, 'bin', 'modules', 'database', 'migrations');
}

const commonSettings = {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST || dotenv.DATABASE_HOST,
    database: process.env.DATABASE_DB || dotenv.DATABASE_DB,
    user: process.env.DATABASE_USER || dotenv.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD || dotenv.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT || dotenv.DATABASE_PORT
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: migrationFolder
  },
  seeds: {
    directory: path.join(migrationFolder, 'seeds')
  },
  debug: false
};

module.exports = {
  development: { ...commonSettings },
  production: { ...commonSettings }
};
