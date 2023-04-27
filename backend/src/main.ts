import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
