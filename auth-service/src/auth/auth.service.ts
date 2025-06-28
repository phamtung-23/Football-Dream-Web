import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User, JwtPayload } from './interfaces/auth.interface';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...result } = user;
        return result as User;
      }
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }

  async validateToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password: _, ...result } = user;
      return result as User;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  login(user: User) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async register(createUserDto: RegisterDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          role: 'USER',
          isActive: true,
          isEmailVerified: false,
        },
      });

      const { password: _, ...result } = user;
      return {
        message: 'User registered successfully',
        user: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error registering user:', error);
      throw new BadRequestException('Registration failed');
    }
  }
}
