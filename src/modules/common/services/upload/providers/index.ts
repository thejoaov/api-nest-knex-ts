/* istanbul ignore file */
import { UPLOAD } from 'settings';

import { LocalProvider } from './local';
import { NullProvider } from './null';
import { S3Provider } from './s3';

export type UploadProvider = 'local' | 's3';

export interface IUploadProvider {
  save(filename: string, base64: string): Promise<string>;
  getPath(filename: string): Promise<string>;
  remove(path: string): Promise<void>;
}

export function getUploadProvider(): IUploadProvider {
  switch (UPLOAD.provider) {
    case 'local':
      return new LocalProvider();
    case 's3':
      return new S3Provider(UPLOAD.aws.credentials, UPLOAD.aws.bucket, UPLOAD.aws.publicUrl);
    default:
      return new NullProvider();
  }
}
