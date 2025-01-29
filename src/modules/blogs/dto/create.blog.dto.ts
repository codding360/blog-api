import { IsString, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly content: string;
}
