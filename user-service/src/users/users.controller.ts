// user-service/src/users/users.controller.ts
import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService, UpdateUserData } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Microservice patterns
  @MessagePattern({ cmd: 'get_user' })
  async getUserMicroservice(data: { id: number }): Promise<User | null> {
    return await this.usersService.getUser(data.id);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUserMicroservice(data: UpdateUserData): Promise<User> {
    return await this.usersService.updateUser(data);
  }

  // HTTP endpoints
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return await this.usersService.getUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Omit<UpdateUserData, 'id'>,
  ): Promise<User> {
    return await this.usersService.updateUser({ id, ...updateData });
  }
}
