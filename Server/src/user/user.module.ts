// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService, PrismaService],
  exports: [UserService], 
  controllers: [UserController]
})
export class UserModule {}