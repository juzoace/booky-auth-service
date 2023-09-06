import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { KFK_CLIENTS, KFK_GROUPS, KFK_NAMES } from './common/utils';
import config from './common/config';

@Module({
  imports: [
    UsersModule,
    ClientsModule.register([
      {
        name: KFK_NAMES.AUTH_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KFK_CLIENTS.AUTH_CLIENT,
            brokers: config.kafka.brokers,
          },
          consumer: {
            groupId: KFK_GROUPS.AUTH_GROUP,
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
