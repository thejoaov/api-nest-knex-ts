/* istanbul ignore file */
import { NotImplementedException } from '@nestjs/common';

import { IUploadProvider } from '.';

export class NullProvider implements IUploadProvider {
  public async save(): Promise<string> {
    throw new NotImplementedException('Invalid upload provider');
  }

  public async getPath(): Promise<string> {
    throw new NotImplementedException('Invalid upload provider');
  }

  public async remove(): Promise<void> {
    throw new NotImplementedException('Invalid upload provider');
  }
}
