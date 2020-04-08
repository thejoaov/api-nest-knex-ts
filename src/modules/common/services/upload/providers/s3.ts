/* istanbul ignore file */
import { BadRequestException } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { APIVersions, ConfigurationOptions } from 'aws-sdk/lib/config';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import format from 'date-fns/format';
import uuid from 'uuid';

import { IUploadProvider } from '.';

export class S3Provider implements IUploadProvider {
  constructor(
    private credentials: ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions,
    private bucket: string,
    private publicUrl: string
  ) {
    if (
      !bucket ||
      !publicUrl ||
      !credentials ||
      !credentials.accessKeyId ||
      !credentials.secretAccessKey ||
      !credentials.region
    )
      throw new Error('Please provide AWS KEYS!');
  }

  public async save(filename: string, base64: string): Promise<string> {
    aws.config.update(this.credentials);

    const ext = filename.split('.').pop();
    filename = `uploads/${format(new Date(), 'yyyy/MM/dd')}/${uuid.v4()}.${ext}`;

    const upload = new aws.S3.ManagedUpload({
      params: {
        Bucket: this.bucket,
        Key: filename,
        Body: Buffer.from(base64, 'base64'),
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${ext}`
      }
    });

    await upload.promise();

    return filename;
  }

  public async getPath(filename: string): Promise<string> {
    if (filename.includes('..')) throw new BadRequestException('changing folder is forbidden');
    return `${this.publicUrl}/${filename}`.replace('//', '/');
  }

  public async remove(path: string): Promise<void> {
    if (!path) throw new BadRequestException('provide a path to exlude');

    const s3 = new aws.S3({ params: { Bucket: this.bucket } });
    await s3.deleteObject({ Bucket: this.bucket, Key: path }).promise();
  }
}
