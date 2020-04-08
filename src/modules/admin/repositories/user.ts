import { Injectable } from '@nestjs/common';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import { enRoles, IUser } from 'modules/database/interfaces/user';
import { User } from 'modules/database/models/user';
import { Page, Transaction } from 'objection';

@Injectable()
export class UserRepository {
  public async list(params: IPaginationParams, transaction?: Transaction): Promise<Page<User>> {
    let query = User.query(transaction)
      .select('*')
      .whereNot('roles', 'like', enRoles.sysAdmin)
      .page(params.page, params.pageSize);

    if (params.orderBy) {
      if (params.orderBy !== 'fullName') {
        query = query.orderBy(params.orderBy, params.orderDirection);
      } else {
        query = query.orderBy('firstName', params.orderDirection).orderBy('lastName', params.orderDirection);
      }
    }

    if (params.term) {
      query = query.where(query => {
        return query
          .where('firstName', 'ilike', `%${params.term}%`)
          .orWhere('lastName', 'ilike', `%${params.term}%`)
          .orWhere('email', 'ilike', `%${params.term}%`);
      });
    }

    return query;
  }

  public async count(transaction?: Transaction): Promise<Number> {
    const result: any = await User.query(transaction)
      .count('id as count')
      .first();

    return Number(result.count);
  }

  public async isEmailAvailable(email: string, skipUserId?: number, transaction?: Transaction): Promise<boolean> {
    let query = User.query(transaction)
      .count('id as count')
      .where({ email })
      .first();

    if (skipUserId) {
      query = query.where('id', '!=', skipUserId);
    }

    const result: any = await query;
    return Number(result.count) === 0;
  }

  public async findById(id: number, transaction?: Transaction): Promise<User> {
    return User.query(transaction)
      .where({ id })
      .first();
  }

  public async findByEmail(email: string, transaction?: Transaction): Promise<User> {
    return User.query(transaction)
      .where({ email })
      .first();
  }

  public async insert(model: IUser, transaction?: Transaction): Promise<User> {
    return User.query(transaction).insert(model);
  }

  public async update(model: IUser, transaction?: Transaction): Promise<User> {
    return User.query(transaction).updateAndFetchById(model.id, <User>model);
  }

  public async remove(id: number, transaction?: Transaction): Promise<void> {
    await User.query(transaction)
      .del()
      .where({ id });
  }
}
