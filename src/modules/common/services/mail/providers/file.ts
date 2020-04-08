/* istanbul ignore file */
import * as fs from 'fs';

import { IMailProvider } from '.';
import { IMail } from '..';

export class FileProvider implements IMailProvider {
  public async send(mail: IMail): Promise<IMail> {
    const outputDir = './output-emails';

    await fs.promises.access(outputDir).catch(() => fs.promises.mkdir(outputDir));

    const filePath = `${outputDir}/${Date.now()}.html`;
    await fs.promises.writeFile(filePath, mail.html);

    console.log(`********\nEmail created: ${filePath}\n*********`);
    mail.providerResponse = { filePath };
    return mail;
  }
}
