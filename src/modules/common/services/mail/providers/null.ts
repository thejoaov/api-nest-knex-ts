/* istanbul ignore file */
import { NotImplementedException } from '@nestjs/common';

import { IMailProvider } from '.';
import { IMail } from '..';

export class NullProvider implements IMailProvider {
  public async send(): Promise<IMail> {
    throw new NotImplementedException('Invalid email provider');
  }
}
