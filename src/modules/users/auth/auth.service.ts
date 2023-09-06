import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { ClientKafka } from '@nestjs/microservices';
import { KFK_NAMES, NotificationEvents } from '../../../common/utils'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        @Inject(KFK_NAMES.NOTIFICATION_SERVICE)
        private notificationClient: ClientKafka
        ) {}

    async registerUser(data:AuthRegisterDto) {
        try {
            
            if (await this.userService.findUser(data)) { 
                throw new UnprocessableEntityException({
                    message: 'The user details are already taken',
                });
            }

            const keyLength = 32;
            const iterations = 10_000;
            const digest = 'sha512';
            const encoding = 'hex'; 
    
            const salt = randomBytes(32).toString(encoding);
            const verificationToken = randomBytes(16).toString(encoding);
            const hash =  pbkdf2Sync(
                data.password,
                salt,
                iterations,
                keyLength,
                digest,
              ).toString(encoding);
            
            const notificationData = await this.userService.registerUser({...data, salt, verificationToken, hash});

            // Send user sign up notification through kafka to notification service
            this.notificationClient.emit(NotificationEvents.NOTIFICATION_USER_REGISTRATION, notificationData);
            
            return {
                message: 'Account created successfully, please verify your email to continue',
            };
        } catch(error) {
            throw new UnprocessableEntityException({
                message: 'Failed to create user',
              });
        }

    }

    async verifyUser(data: string) {
        return await this.userService.verifyUser(data);
    }

    async deleteUnverifiedAccounts() {
        return this.userService.deleteUnverifiedAccounts()
    }

}
