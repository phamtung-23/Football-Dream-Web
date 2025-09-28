import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'List of teams' })
  @Get()
  async findAll() {
    const teams = await this.teamsService.findAll();
    return ResponseHelper.success(teams, 'Teams retrieved successfully');
  }

  @ApiOperation({ summary: 'Get team by ID' })
  @ApiResponse({ status: 200, description: 'Team details' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const team = await this.teamsService.findOne(id);
    return ResponseHelper.success(team, 'Team retrieved successfully');
  }
}
