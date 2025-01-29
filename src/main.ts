import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { AppModule } from '@um/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rateLimiter = new RateLimiterMemory({ points: 5, duration: 60 }); // 5 requests per minute
  app.use(helmet());
  app.use(async (req, res, next) => {
    try {
      await rateLimiter.consume(req.ip);
      next();
    } catch {
      res.status(429).send('Too Many Requests, please try again later.');
    }
  });
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Auth & User Management API')
    .setDescription(
      'API documentation for authentication and user management by sawsen.fattahi@gmail.com'
    )
    .setVersion('1.0')
    .addBearerAuth() // Add JWT Bearer auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
