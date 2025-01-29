import { Module } from '@nestjs/common';
import { BlogModule } from './modules/blogs/blog.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [BlogModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
