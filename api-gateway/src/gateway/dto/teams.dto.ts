import { ApiProperty } from '@nestjs/swagger';

export class TeamDto {
  @ApiProperty({
    description: 'Team ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Team name',
    example: 'Manchester United',
  })
  name: string;

  @ApiProperty({
    description: 'Team city',
    example: 'Manchester',
  })
  city: string;

  @ApiProperty({
    description: 'Team country',
    example: 'England',
  })
  country: string;

  @ApiProperty({
    description: 'Team logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  logo?: string;

  @ApiProperty({
    description: 'Team creation date',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;
}

export class TeamsResponseDto {
  @ApiProperty({
    description: 'List of teams',
    type: [TeamDto],
  })
  data: TeamDto[];
}
