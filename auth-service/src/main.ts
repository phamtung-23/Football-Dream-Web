import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create HTTP application
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Connect microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    },
  });

  // Start microservice
  await app.startAllMicroservices();

  // Start HTTP server
  await app.listen(process.env.PORT ?? 3001);
  console.log(
    'Auth Service is running on port 3001 (HTTP) and Redis (Microservice)',
  );
}
bootstrap();
