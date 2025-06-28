// api-gateway/src/gateway/gateway.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GatewayService } from './gateway.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UserProfileDto,
  ErrorResponseDto,
} from './dto/auth.dto';
import { TeamDto, TeamsResponseDto } from './dto/teams.dto';
import { UserResponseDto, UpdateUserDto } from './dto/users.dto';

interface ErrorWithResponse {
  message?: string;
  status?: number;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

@ApiTags('Gateway')
@Controller('api/v1')
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly httpService: HttpService,
  ) {}

  // Auth Service routes
  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    type: ErrorResponseDto,
  })
  async register(
    @Body(ValidationPipe) data: RegisterDto,
  ): Promise<AuthResponseDto> {
    try {
      return await this.gatewayService.register(data);
    } catch (error) {
      const err = error as ErrorWithResponse;
      throw new HttpException(
        err.message || 'Registration failed',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  async login(@Body(ValidationPipe) data: LoginDto): Promise<AuthResponseDto> {
    try {
      return await this.gatewayService.login(data);
    } catch (error) {
      const err = error as ErrorWithResponse;
      throw new HttpException(
        err.message || 'Login failed',
        err.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('auth/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async getProfile(@Req() req: Request): Promise<UserProfileDto> {
    try {
      const response = await lastValueFrom(
        this.httpService.get('http://auth-service:3001/api/v1/auth/profile', {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return response.data;
    } catch (error) {
      const err = error as ErrorWithResponse;
      throw new HttpException(
        err.response?.data?.message || 'Failed to get profile',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Teams Service routes
  @Get('teams')
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({
    status: 200,
    description: 'Teams retrieved successfully',
    type: TeamsResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async getTeams(): Promise<TeamsResponseDto> {
    try {
      const response = await lastValueFrom(
        this.httpService.get('http://teams-service:3003/api/v1/teams'),
      );
      return response.data;
    } catch (error) {
      const err = error as ErrorWithResponse;
      throw new HttpException(
        err.response?.data?.message || 'Failed to get teams',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('teams/:id')
  @ApiOperation({ summary: 'Get team by ID' })
  @ApiParam({
    name: 'id',
    description: 'Team ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Team retrieved successfully',
    type: TeamDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Team not found',
    type: ErrorResponseDto,
  })
  async getTeam(@Param('id') id: string): Promise<TeamDto> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`http://teams-service:3003/api/v1/teams/${id}`),
      );
      return response.data;
    } catch (error) {
      const err = error as ErrorWithResponse;
      throw new HttpException(
        err.response?.data?.message || 'Failed to get team',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // User Service routes
  @Get('users/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  async getUser(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`http://user-service:3002/api/v1/users/${id}`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return response.data;
    } catch (error) {
      const err = error as ErrorWithResponse;
      throw new HttpException(
        err.response?.data?.message || 'Failed to get user',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('users/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateData: UpdateUserDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    try {
      const response = await lastValueFrom(
        this.httpService.put(
          `http://user-service:3002/api/v1/users/${id}`,
          updateData,
          {
            headers: { Authorization: req.headers.authorization },
          },
        ),
      );
      return response.data;
    } catch (error) {
      const err = error as ErrorWithResponse;
      throw new HttpException(
        err.response?.data?.message || 'Failed to update user',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
