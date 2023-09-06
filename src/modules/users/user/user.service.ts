import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto'
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async registerUser(data: CreateUserDto) {
      return  await this.userRepository.createUser(data)
    }

    async findUser(data: AuthRegisterDto): Promise<number> {
      return  await this.userRepository.findUser(data)
    }

    async verifyUser(data: string) {
      return await this.userRepository.verifyUser(data)
    }
}
