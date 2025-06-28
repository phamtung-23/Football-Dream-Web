import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Request,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  MessageResponseDto,
  UserProfileDto,
  ErrorResponseDto,
} from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Microservice message patterns (for api-gateway)
  @MessagePattern({ cmd: 'register' })
  async registerMicroservice(data: RegisterDto): Promise<MessageResponseDto> {
    return await this.authService.register(data);
  }

  @MessagePattern({ cmd: 'login' })
  async loginMicroservice(data: LoginDto): Promise<AuthResponseDto> {
    // First validate the user
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'profile' })
  async getProfileMicroservice(data: {
    authorization: string;
  }): Promise<UserProfileDto> {
    // Extract token from authorization header
    const token = data.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      // Verify and get user from token
      const user = await this.authService.validateToken(token);
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // HTTP endpoints (for direct access)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @Post('register')
  async register(
    @Body(new ValidationPipe()) registerDto: RegisterDto,
  ): Promise<MessageResponseDto> {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserProfileDto,
  })
  @Get('profile')
  async getProfile(@Request() req): Promise<UserProfileDto> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const user = await this.authService.validateToken(token);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  }
}
