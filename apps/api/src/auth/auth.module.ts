import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { GoogleTokenGuard } from './google-token.guard';
import { User } from '../users/user.entity';

@Module({
  imports: [PassportModule, UsersModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService, GoogleStrategy, GoogleTokenGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
