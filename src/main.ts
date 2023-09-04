import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from './common/config';
import { Logger, RequestMethod } from '@nestjs/common';
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
   .setDescription('API Documentation for BookVault Auth Service')
   .setVersion('1.0')
   .addServer(config.baseUrl)
   .build();

   app.setGlobalPrefix(`api`, {
    exclude: [
      { path: '', method: RequestMethod.ALL },
      { path: 'health', method: RequestMethod.ALL },
    ],
  });
 SwaggerModule.setup(
   '/docs',
   app,
   SwaggerModule.createDocument(app, swagConfig),
 );
   
 await app.listen(port);
 app.startAllMicroservices();
}
bootstrap();
