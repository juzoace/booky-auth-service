/* eslint-disable prettier/prettier */
import { Prisma } from '@prisma/client';

export class User {
  id: string;
  email: string
  firstName: string      
  lastName: string
  isActive: boolean
  isEmailVerified: boolean
  hash: string
  salt:  string
  phoneNumber: string
  created_at: Date;
  updated_at: Date;
  lastLogin: Date 
//   books?: Prisma.BooksOnOrderCreateNestedManyWithoutBookInput;
}
