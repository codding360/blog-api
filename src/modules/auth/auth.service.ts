import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('Wrong credentials');
    }

    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Passwords do not match');
    }
    const token = await this.jwtService.signAsync(
      { username: user.username, id: user.id },
      {
        secret: process.env.JWT_SECRET || 'your_secret_key',
        expiresIn: '1h',
      },
    );

    if (!token) {
      throw new ForbiddenException('Wrong credentials');
    }
    return {
      message: 'Successfully logged in',
      authorization: token,
    };
  }

  async register(registerDto: RegisterDto) {
    const { username, password, email } = registerDto;
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (user && user.email === email) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.hashPassword(password);
    await this.prismaService.user.create({
      data: { ...registerDto, password: hashedPassword },
    });
    return { message: 'User created successfully' };
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
