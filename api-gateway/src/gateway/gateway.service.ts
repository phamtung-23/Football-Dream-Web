// api-gateway/src/gateway/gateway.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class GatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    return this.authService
      .send({ cmd: 'register' }, data)
      .toPromise() as Promise<AuthResponseDto>;
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    return this.authService
      .send({ cmd: 'login' }, data)
      .toPromise() as Promise<AuthResponseDto>;
  }

  getProfile(authorization: string): Observable<any> {
    return this.authService.send({ cmd: 'profile' }, { authorization });
  }

  getUser(userId: string, authorization: string): Observable<any> {
    return this.userService.send(
      { cmd: 'get-user' },
      { userId, authorization },
    );
  }
}
