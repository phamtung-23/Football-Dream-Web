import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, PassportModule],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
