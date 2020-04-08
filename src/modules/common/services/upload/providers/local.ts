/* istanbul ignore file */
import { BadRequestException } from '@nestjs/common';
import format from 'date-fns/format';
import fs from 'fs';
import uuid from 'uuid';

import { IUploadProvider } from '.';

export class LocalProvider implements IUploadProvider {
  private readonly DIR = 'upload';

  public async save(filename: string, base64: string): Promise<string> {
    const baseFolder = format(new Date(), 'yyyy/MM/dd');
    await this.checkFolder(baseFolder);

    const ext = filename.split('.').pop();
    filename = `${baseFolder}/${uuid.v4()}.${ext}`;

    const path = await this.getPath(filename);
    await fs.promises.writeFile(path, base64, <any>'base64');
    return filename;
  }

  public async getPath(filename: string): Promise<string> {
    if (filename.includes('..')) throw new BadRequestException('changing folder is forbidden');
    return `${this.DIR}/${filename}`;
  }

  public async remove(filename: string): Promise<void> {
    if (!filename) throw new BadRequestException('provide a path to exlude');

    const path = await this.getPath(filename);
    await fs.promises.unlink(path);
  }

  private async checkFolder(baseFolder: string): Promise<void> {
    await fs.promises
      .access(`${this.DIR}/${baseFolder}`)
      .catch(() => fs.promises.mkdir(`${this.DIR}/${baseFolder}`, { recursive: true }));
  }
}
