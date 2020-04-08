import { Injectable } from '@nestjs/common';
import { IDevice } from 'modules/database/interfaces/device';
import { Device } from 'modules/database/models/device';
import { Transaction } from 'objection';

@Injectable()
export class DeviceRepository {
  public async findById(id: string, transaction: Transaction = null): Promise<Device> {
    return Device.query(transaction).findById(id);
  }

  public async insert(model: IDevice, transaction: Transaction = null): Promise<Device> {
    return Device.query(transaction).insertAndFetch(model as any);
  }

  public async update(model: IDevice, transaction: Transaction = null): Promise<Device> {
    return Device.query(transaction).patchAndFetchById(model.id, model as any);
  }

  public async remove(deviceId: string, transaction: Transaction = null): Promise<void> {
    await Device.query(transaction).deleteById(deviceId);
  }
}
