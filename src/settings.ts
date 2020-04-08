import dotenv from 'dotenv';
import { MailProvider } from 'modules/common/services/mail/providers';
import { UploadProvider } from 'modules/common/services/upload/providers';

const ENV_FILE = dotenv.config().parsed || {};

export const NODE_ENV = (process.env.NODE_ENV || 'production').trim();
export const SENTRY_DSN = (process.env.SENTRY_DSN || '').trim();

export const VERSION = (process.env.VERSION || ENV_FILE.VERSION || 'dev').trim();

export const API_DNS = (process.env.API_DNS || '').trim();
export const APP_DNS = (process.env.APP_DNS || '').trim();

export const FIREBASE_KEY = (process.env.FIREBASE_KEY || '').trim();

export const IS_DEV = NODE_ENV !== 'production' && NODE_ENV !== 'test';
export const IS_PROD = NODE_ENV === 'production';
export const IS_TEST = NODE_ENV === 'test';

export const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
export const DATABASE_DB = process.env.DATABASE_DB || 'database';
export const DATABASE_USER = process.env.DATABASE_USER || 'docker';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '123mudar';
export const DATABASE_PORT = Number(process.env.DATABASE_PORT) || 3002;

export const BCRYPT_SALT_FACTOR = NODE_ENV === 'test' ? 4 : 11;

export const ASSETS_FOLDER = `${__dirname}/assets`;

export const AUTH = {
  timeout: 480, // 8 hours
  appTimeout: 1440, // 24 hours
  resetPasswordTimeout: 1 * 60 * 24, //2 days
  secret: Buffer.from(
    'RSd7w8utAWSjmJ8QOGt2OayydAqoUmL3sBTY7PqCVqOqaNn3RH38lMlNdDv5zoTQZH8GrR80YNFpQ3jKnDRMPDuwqaODObyyX0LS',
    'base64'
  ).toString('utf8')
};

if (NODE_ENV !== 'test' && !['aws', 'mailgun', 'file'].includes(process.env.MAIL_PROVIDER)) {
  throw new Error(`INVALID MAIL_PROVIDER: ${process.env.MAIL_PROVIDER}`);
}

export const MAIL = {
  provider: process.env.MAIL_PROVIDER as MailProvider,
  from: process.env.MAIL_FROM,
  mailgun: {
    apiKey: process.env.MAIL_MAILGUN_APIKEY,
    domain: process.env.MAIL_MAILGUN_DOMAIN
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION
  }
};

if (NODE_ENV !== 'test' && !['local', 's3'].includes(process.env.UPLOAD_PROVIDER)) {
  throw new Error(`INVALID UPLOAD_PROVIDER: ${process.env.UPLOAD_PROVIDER}`);
}

export const UPLOAD = {
  provider: process.env.UPLOAD_PROVIDER as UploadProvider,
  aws: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESSKEY,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION
    },
    bucket: process.env.AWS_S3_BUCKET,
    publicUrl: process.env.AWS_S3_URL
  }
};

if (NODE_ENV !== 'test') {
  console.table({
    NODE_ENV,
    MAIL_PROVIDER: MAIL.provider,
    UPLOAD_PROVIDER: UPLOAD.provider,
    SENTRY_ENABLED: !!SENTRY_DSN,
    API_DNS,
    APP_DNS
  });
}
