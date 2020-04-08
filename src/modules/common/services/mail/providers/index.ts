/* istanbul ignore file */
import { MAIL } from 'settings';

import { IMail } from '..';
import { AwsProvider } from './aws';
import { FileProvider } from './file';
import { MailgunProvider } from './mailgun';
import { NullProvider } from './null';

export type MailProvider = 'aws' | 'mailgun' | 'file';

export interface IMailProvider {
  send(mail: IMail): Promise<IMail>;
}

export function getEmailProvider(): IMailProvider {
  switch (MAIL.provider) {
    case 'aws':
      return new AwsProvider(MAIL.aws);
    case 'mailgun':
      return new MailgunProvider(MAIL.mailgun);
    case 'file':
      return new FileProvider();
    default:
      return new NullProvider();
  }
}
