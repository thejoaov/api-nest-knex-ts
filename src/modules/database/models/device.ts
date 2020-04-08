import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'objection';

import { IDevice } from '../interfaces/device';
import { User } from './user';

export class Device extends Model implements IDevice {
  @ApiProperty({ type: 'string' })
  public id: string;
  @ApiProperty({ type: 'integer' })
  public userId?: number;
  @ApiProperty({ type: 'string' })
  public name: string;
  @ApiProperty({ type: 'string' })
  public currentToken: string;
  @ApiProperty({ type: 'string' })
  public notificationToken?: string;
  @ApiProperty({ type: 'string', format: 'date-time' })
  public createdDate: Date;
  @ApiProperty({ type: 'string', format: 'date-time' })
  public updatedDate: Date;

  public user: User;

  public static get tableName(): string {
    return 'Device';
  }

  public static get relationMappings(): any {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        filter: (query: any) => query.select('id', 'firstName', 'lastName', 'email'),
        join: {
          from: 'User.id',
          to: 'Device.userId'
        }
      }
    };
  }

  public $beforeInsert(): void {
    this.createdDate = this.updatedDate = new Date();
  }

  public $beforeUpdate(): void {
    this.updatedDate = new Date();
  }

  public $formatJson(data: IDevice): IDevice {
    delete data.notificationToken;
    delete data.currentToken;
    return data;
  }
}
