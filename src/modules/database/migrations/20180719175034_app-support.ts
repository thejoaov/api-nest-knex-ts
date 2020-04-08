import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Device', table => {
    table
      .string('id', 150)
      .notNullable()
      .primary();

    table
      .integer('userId')
      .nullable()
      .unsigned()
      .references('id')
      .inTable('User')
      .onDelete('CASCADE');

    table.string('name', 150).notNullable();
    table.uuid('currentToken').notNullable();
    table.string('notificationToken', 250).nullable();
    table.dateTime('createdDate').notNullable();
    table.dateTime('updatedDate').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Device');
}
