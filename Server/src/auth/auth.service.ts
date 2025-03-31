import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService : UserService) {}

  async validateUser({ email, password }: AuthPayloadDto) {
    const user = await this.userService.validateUser(email, password);
    return user;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role 
    };
    
    return this.jwtService.sign(payload)
  }
}
