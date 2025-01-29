import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@um/common/strategies/jwt.strategy';
import { environment } from '@um/config/environment';
import { AuthBlacklistService } from '@um/modules/auth/auth-blacklist.service';
import { AuthController } from '@um/modules/auth/auth.controller';
import { AuthenticateUserUseCase } from '@um/modules/auth/use-cases/authenticate-user.use-case';
import { DatabaseModule } from '@um/modules/users/database/mongo/database.module';
import { UserRepositoryAdapter } from '@um/modules/users/database/repositories/user-repository.adapter';
import { GetUserByIdUseCase } from '@um/modules/users/use-cases/get-user-by-id.use-case';
import { LogoutUserUseCase } from '@um/modules/users/use-cases/logout.use-case';
import { UsersModule } from '@um/modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(environment.JWT_SECRET),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserRepositoryAdapter,
    JwtStrategy,
    AuthBlacklistService,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    LogoutUserUseCase,
  ],
  exports: [AuthBlacklistService],
})
export class AuthModule {}
