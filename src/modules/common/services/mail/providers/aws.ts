/* istanbul ignore file */
import * as aws from 'aws-sdk';
import { APIVersions, ConfigurationOptions } from 'aws-sdk/lib/config';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

import { IMailProvider } from '.';
import { IMail } from '..';

export class AwsProvider implements IMailProvider {
  constructor(private credentials: ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions) {
    if (!credentials || !credentials.accessKeyId || !credentials.secretAccessKey || !credentials.region)
      throw new Error('Please provide AWS KEYS!');
  }

  public async send(mail: IMail): Promise<IMail> {
    aws.config.update(this.credentials);
    const session = new aws.SES();

    const params = {
      Source: mail.from,
      Destination: { ToAddresses: [mail.to] },
      Message: {
        Subject: { Data: mail.subject, Charset: 'UTF-8' },
        Body: { Html: { Data: mail.html, Charset: 'UTF-8' } }
      }
    };

    return new Promise<IMail>((resolve, reject) => {
      session.sendEmail(params, (err, data) => {
        if (err) return reject(err);

        mail.providerResponse = data;
        resolve(mail);
      });
    });
  }
}
