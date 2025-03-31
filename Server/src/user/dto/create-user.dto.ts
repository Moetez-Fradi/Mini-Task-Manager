import { IsString, IsEmail, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER; 
}