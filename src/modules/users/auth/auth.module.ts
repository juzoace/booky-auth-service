import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; 
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport,  ClientProviderOptions } from '@nestjs/microservices';
import { KFK_CLIENTS, KFK_GROUPS, KFK_NAMES } from 'src/common/utils';
import config from 'src/common/config';
@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService, UserRepository, PrismaService],
    imports: [
        ClientsModule.register([
            {
              transport: Transport.KAFKA,
              name: KFK_NAMES.NOTIFICATION_SERVICE,
              options: {
                client: {
                    brokers: config.kafka.brokers,
                    clientId: KFK_CLIENTS.NOTIFICATION_CLIENT,
                    retry: {
                        retries: 3,
                    },
                },
                producerOnlyMode: true,
                consumer: {
                    groupId: KFK_GROUPS.NOTIFICATION_GROUP
                },
              } 
            }
        ]as ClientProviderOptions[])
    ]
})
export class AuthModule {}
