import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as expressBasicAuth from 'express-basic-auth';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as serveStatic from 'serve-static';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(
    [
      '/api/auth/*',
      '/api/user/*',
      '/api/match/*',
      '/api/chat/*',
      '/api/room/*',
      '/api/notifications/*',
      '/api',
    ],
    expressBasicAuth({
      challenge: true,
      users: { ['chanhyle']: 'handsome' },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('ft_transcendence API description')
    .setVersion('0.0.1')
    .addTag('ft_transcendence')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const publicPath = join(__dirname, '..', 'images');
  app.use('/images', serveStatic(publicPath, { index: false }));
  app.use(express.json({ limit: '10mb' }));
  await app.listen(3000);
}
bootstrap();
