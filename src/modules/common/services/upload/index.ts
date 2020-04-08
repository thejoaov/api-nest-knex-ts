/* istanbul ignore file */
import { Injectable } from '@nestjs/common';

import { getUploadProvider, IUploadProvider } from './providers';

@Injectable()
export class UploadService {
  private provider: IUploadProvider;

  constructor() {
    this.provider = getUploadProvider();
  }

  public async save(filename: string, base64: string): Promise<string> {
    base64 = base64.split(',').pop();
    return this.provider.save(filename, base64);
  }

  public async getPath(filename: string): Promise<string> {
    return this.provider.getPath(filename);
  }

  public async remove(path: string): Promise<void> {
    return this.provider.remove(path);
  }
}
