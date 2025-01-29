import { FastifyRequest } from 'fastify';
import { User } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}
