import {
  Injectable,
  BadRequestException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Blog } from '@prisma/client';
import { CreateBlogDto } from './dto/create.blog.dto';
import { UpdateBlogDto } from './dto/update.blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(createBlogDto: CreateBlogDto, userId: string): Promise<Blog> {
    try {
      return this.prisma.blog.create({
        data: {
          author: {
            connect: {
              id: Number(userId),
            },
          },
          ...createBlogDto,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string): Promise<Blog | null> {
    return this.prisma.blog.findUnique({ where: { id: Number(id) } });
  }

  async update(
    blogId: string,
    userId: string,
    data: UpdateBlogDto,
  ): Promise<Blog> {
    const blog = await this.findOne(blogId);
    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.authorId !== Number(userId)) {
      throw new BadRequestException();
    }

    return this.prisma.blog.update({
      where: { id: Number(blogId), authorId: Number(userId) },
      data: data,
    });
  }

  async remove(blogId: string, userId: string): Promise<Blog> {
    const blog = await this.findOne(blogId);
    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.authorId !== Number(userId)) {
      throw new BadRequestException();
    }
    return this.prisma.blog.update({
      where: { id: Number(blogId), authorId: Number(userId) },
      data: { ...blog, isDeleted: true },
    });
  }

  async findAll(): Promise<Blog[]> {
    return this.prisma.blog.findMany({
      where: { isDeleted: false },
    });
  }
}
