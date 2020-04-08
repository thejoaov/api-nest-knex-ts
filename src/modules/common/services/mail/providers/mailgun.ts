/* istanbul ignore file */
import mailgunApi, { ConstructorParams } from 'mailgun-js';

import { IMail } from '..';

export class MailgunProvider {
  private client: ReturnType<typeof mailgunApi>;

  constructor(config: ConstructorParams) {
    if (!config) throw new Error('Please provide MAIL_MAILGUN_APIKEY!');
    this.client = mailgunApi(config);
  }

  public async send(mail: IMail): Promise<IMail> {
    mail.providerResponse = await this.client.messages().send(mail);
    return mail;
  }
}
