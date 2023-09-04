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
            const hash =  pbkdf2Sync(
                data.password,
                salt,
                iterations,
                keyLength,
                digest,
              ).toString(encoding);
     
            const user = await this.userService.registerUser({...data, salt, hash});

            // Send user sign up notification through kafka to notification service
            this.notificationClient.emit(NotificationEvents.CREATE_USER_CREATION, user);
            
            return user;
        } catch(error) {
            throw new UnprocessableEntityException({
                message: 'Failed to create user',
              });
        }

    }

    async verifyEmail(data) {

    }

}
