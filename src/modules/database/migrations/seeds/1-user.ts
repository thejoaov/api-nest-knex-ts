import * as Knex from 'knex';
import { enRoles, IUser } from 'modules/database/interfaces/user';

export async function seed(knex: Knex): Promise<void> {
  const adminUser: IUser = {
    firstName: 'Admilson',
    lastName: 'Adminion',
    email: 'admin@admin.com.br',
    password: '$2b$11$Ht0vFtWZHNh0nOlFr1iLUu2/.p//LlghbIxzckI1bmFjVNDn78tKm', //senha@123
    roles: enRoles.sysAdmin as any,
    createdDate: new Date(),
    updatedDate: new Date()
  };

  const users = await knex.count().from('User').where({ email: adminUser.email }).first();

  if (Number(users.count) > 0) return;

  await knex.insert(adminUser).into('User');
}
