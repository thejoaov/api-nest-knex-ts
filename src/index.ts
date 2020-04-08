import './global';

import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as sentry from '@sentry/node';
import { ExceptionFilter } from 'filters/exception';
import { ApplicationModule } from 'modules/';
import morgan from 'morgan';
import { IS_DEV, IS_PROD, NODE_ENV, SENTRY_DSN, VERSION } from 'settings';

sentry.init({
  dsn: SENTRY_DSN,
  environment: NODE_ENV,
  release: VERSION
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApplicationModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  if (IS_DEV) {
    app.use(morgan('dev'));
  }

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: IS_PROD, forbidUnknownValues: true }));
  app.useGlobalFilters(new ExceptionFilter(httpAdapter));

  const swaggerOptions = new DocumentBuilder()
    .setTitle('project-api')
    .setDescription('project-description')
    .setVersion(`1.${VERSION}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(3000, '0.0.0.0', () => {
    console.log('******************************');
    console.log(`SERVER STARTED as ${NODE_ENV}`);
    console.log('******************************');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason);
    console.log(promise);
  });

  process.on('uncaughtException', err => {
    console.error(err);
  });

  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch(err => console.error(err));
