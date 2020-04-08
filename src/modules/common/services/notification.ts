/* istanbul ignore file */
import { HttpService, Injectable } from '@nestjs/common';
import { Device } from 'modules/database/models/device';
import { FIREBASE_KEY } from 'settings';

@Injectable()
export class NotificationService {
  constructor(private http: HttpService) {}

  public async sendToUser(userId: number, title: string, body: string, payload: any): Promise<any> {
    const devices = await Device.query()
      .where({ userId })
      .whereNotNull('notificationToken');

    if (!devices.length) return;

    return this.send(
      title,
      body,
      { userId, ...payload },
      null,
      devices.map(d => d.notificationToken)
    );
  }

  public async sendToAll(title: string, body: string, payload: any): Promise<any> {
    return this.send(title, body, payload, '/topics/all');
  }

  private send(title: string, body: string, payload: any, to?: string, registrationIds?: string[]): Promise<any> {
    return this.http
      .post(
        'https://fcm.googleapis.com/fcm/send',
        {
          to,
          // eslint-disable-next-line camelcase
          registration_ids: registrationIds,
          notification: {
            title,
            body,
            icon: 'ic_notification',
            color: '#45296e'
          },
          payload
        },
        {
          headers: { Authorization: `key=${FIREBASE_KEY}` }
        }
      )
      .toPromise();
  }
}
