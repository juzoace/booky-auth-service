import { randomBytes } from 'node:crypto';
import {
    Injectable,
    UnprocessableEntityException,
    NotFoundException,
  } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto';

@Injectable()
export class UserRepository {

    constructor(private prisma: PrismaService) {}

    async createUser(data: CreateUserDto) {

        try {

        const expirationTime = new Date();

        expirationTime.setHours(expirationTime.getHours() + 4); 
       
        const user = await this.prisma.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phone,
                    isActive: false,
                    isEmailVerified: false,
                    verificationToken: {
                        create: {
                            token: data.verificationToken,
                            expires_at: expirationTime
                        }
                    },
                    hash: data.hash,
                    salt: data.salt,
                    updated_at: new Date(),
                }
        })
       
        return {
            id: user.id,
            text: `Hello ${user.firstName}, Welcome to Booky, your number one online book store. Thank you for signing up, click the link`,
            html: ``,
            title: `Account confirmation instruction`,
            messageId: `${randomBytes(32).toString('hex')}`,
            attempts: 1,
            template: '',
            priority: 'high',
            channels: 'email',
            recipient: [user.email],
            data: {
                token: data.verificationToken,
                expires_at: expirationTime
            },
            webhook: '',
            error: 'Failed to send email',
        };

        } catch(error) {

            throw new UnprocessableEntityException({
                message: 'Failed to create user',
            });

        }
    }

    async findUser(data: AuthRegisterDto): Promise<number> {

        try {
           
            const availableUsers = await this.prisma.user.count({
                where: {
                    email: data.email,
                }
            })

            return availableUsers

        } catch (error) {

            throw new UnprocessableEntityException({
                message: 'Failed to fetch user',
            });

        }
    }

    async verifyUser(data: string) {
        try {
          // 1. Find the VerificationToken based on the provided id
          const verificationToken = await this.prisma.verificationToken.findFirst({
            where: {
              token: data,
            },
          });
      
          if (verificationToken === null) {
            throw new NotFoundException('Verification token not found');
          }
      
          // 2. Check if the token has expired
          const currentDateTime = new Date();
          if (verificationToken.expires_at <= currentDateTime) {
            throw new UnprocessableEntityException('Verification token has expired');
          }
      
          // 3. Find the associated User using the userId from VerificationToken
          const user = await this.prisma.user.findUnique({
            where: {
              id: verificationToken.userId,
              isEmailVerified: false
            },
          });
      
          if (!user) {
            throw new NotFoundException('User not found');
          }
      
          // 4. Update the User's isActive and isEmailVerified fields
          const userUpdate = await this.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              isActive: true,
              isEmailVerified: true,
            },
          });
      
          if (!userUpdate) {
            throw new UnprocessableEntityException('Failed to update user');
          }
      
          // Transaction successfully completed
          return {
            message: 'Verification and user update successful',
          };
        } catch (error) {
          // Rethrow errors for handling in the service function
          throw error;
        }
    }
      
}