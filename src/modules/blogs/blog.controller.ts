import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create.blog.dto';
import { UpdateBlogDto } from './dto/update.blog.dto';
import { Blog } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

@ApiBearerAuth('JWT-auth')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @Request() req: FastifyRequest,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<Blog> {
    const userId = req.userId;
    return this.blogService.create({ ...createBlogDto }, userId);
  }

  @Get('find/:id')
  findOne(@Param('id') id: string): Promise<Blog | null> {
    return this.blogService.findOne(id);
  }

  @Get('list')
  findAll(): Promise<Blog[]> {
    return this.blogService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Request() req: FastifyRequest,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    const userId = req.userId;
    return this.blogService.update(id, userId, updateBlogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Request() req: FastifyRequest,
    @Param('id') id: string,
  ): Promise<Blog> {
    const authorId = req.userId;
    return this.blogService.remove(id, authorId);
  }
}
