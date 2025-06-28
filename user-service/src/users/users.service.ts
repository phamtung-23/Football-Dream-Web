// user-service/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

export interface UpdateUserData {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    return await this.prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    });
  }
}
