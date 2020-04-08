import { Injectable } from '@nestjs/common';
import inlineCss from 'inline-css';
import * as pug from 'pug';
import { ASSETS_FOLDER, IS_DEV, IS_TEST, MAIL } from 'settings';

import { UrlService } from '../url';
import { getEmailProvider, IMailProvider } from './providers';

export interface IMail {
  from: string;
  to: string;
  template?: string;
  subject: string;
  html: string;

  providerResponse?: any;
}

@Injectable()
export class MailService {
  private provider: IMailProvider;

  constructor(private urlService: UrlService) {
    this.provider = getEmailProvider();
  }

  public async send(to: string, subject: string, template: string, data: any): Promise<IMail> {
    data = this.setDefaultVariables(data);

    const html = await this.renderTemplate(template, data);
    const mail: IMail = { from: MAIL.from, to, subject, html, template };

    /* istanbul ignore next */
    return IS_TEST ? mail : this.provider.send(mail);
  }

  private async renderTemplate(template: string, data: any): Promise<string> {
    const html = pug.renderFile(`${ASSETS_FOLDER}/mail/${template}.pug`, {
      ...data,
      pretty: IS_DEV
    });

    return inlineCss(html, { url: this.urlService.home() || 'no-url' });
  }

  private setDefaultVariables(data: any): any {
    data.urlSite = this.urlService.home();
    data.currentYear = new Date().getFullYear();
    return data;
  }
}
