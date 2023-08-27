import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from './common/config';
import { Logger } from '@nestjs/common';
import { KFK_CLIENTS, ValidationPipe, HttpExceptionFilter, ResponseInterceptor } from './common/utils';

import { AppModule } from './app.module';

let port = 80;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.kafka.brokers,
        clientId: KFK_CLIENTS.AUTH_CLIENT,
      },
    },
  });

  // global pipes for request validation
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  
  // app.useGlobalInterceptors(new ResponseInterceptor());

  // enable cors
  app.enableCors({ origin: true });
  // bind port to env variable
  port = config.port;

   // setup swagger docs
   const swagConfig = new DocumentBuilder()
   .setTitle('Auth Service')
   .setDescription('API Documentation for BookVault')
   .setVersion('1.0')
   // .addServer(config.baseUrl)
   .addBearerAuth(
     {
       type: 'http',
       scheme: 'bearer',
       name: 'Authorization',
       bearerFormat: 'JWT',
       in: 'header',
     },
     'JWT',
   )
   .build();
 SwaggerModule.setup(
   '/docs',
   app,
   SwaggerModule.createDocument(app, swagConfig),
 );
   
 await app.listen(port);
 app.startAllMicroservices();
}
bootstrap();
