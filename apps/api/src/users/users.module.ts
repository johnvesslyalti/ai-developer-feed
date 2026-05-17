import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GoogleTokenGuard } from '../auth/google-token.guard';

@Module({
  providers: [UsersService, GoogleTokenGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
