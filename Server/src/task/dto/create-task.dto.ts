import { IsString, IsIn, IsEmail, IsEnum, IsUUID, IsOptional } from 'class-validator';

export const ALLOWED_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
export const ALLOWED_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export class CreateTaskDto {
    @IsString()
    title?: string;
  
    @IsString()
    description?: string;
  
    @IsIn(ALLOWED_STATUSES)
    status?: typeof ALLOWED_STATUSES[number];
  
    @IsIn(ALLOWED_PRIORITIES)
    priority?: typeof ALLOWED_PRIORITIES[number];
  
    @IsEmail()
    userEmail: string;
}