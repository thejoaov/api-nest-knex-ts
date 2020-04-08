import { Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import knex from 'knex';
import * as objection from 'objection';
import { NODE_ENV } from 'settings';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const config = require('../../../knexfile');

@Module({
  imports: [],
  exports: []
})
export class DatabaseModule implements OnApplicationBootstrap, OnApplicationShutdown {
  private connection: knex;

  public async onApplicationBootstrap() {
    this.connection = knex(config[NODE_ENV]);
    objection.Model.knex(this.connection);

    await this.connection.migrate.latest();
    await this.connection.seed.run();

    console.log('DATABASE READY');
  }

  public async onApplicationShutdown() {
    await this.connection.destroy();
  }
}
