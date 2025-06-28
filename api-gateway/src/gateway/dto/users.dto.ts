import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
  })
  role: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User data',
    type: UserDto,
  })
  data: UserDto;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    required: false,
  })
  role?: string;
}
