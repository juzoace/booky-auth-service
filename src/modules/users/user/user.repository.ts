import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { AuthRegisterDto } from './dtos/auth-register.dto';

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {}

    async createUser(data: CreateUserDto): Promise<Partial<User>> {

        try {
        const user = await this.prisma.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phone,
                    isActive: true,
                    isEmailVerified: false,
                    hash: data.hash,
                    salt: data.salt,
                }
            })

        return user;

        } catch(error) {
            throw new UnprocessableEntityException({
                message: 'Failed to create user',
            });
        }
    }

    async findUser(data: AuthRegisterDto): Promise<Partial<User>> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: data.email,
                    phoneNumber: data.phone
                }
            })
            return user
        } catch (error) {
            throw new UnprocessableEntityException({
                message: 'Failed to fetch user',
            });
        }
    }
}