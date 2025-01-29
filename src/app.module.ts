import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { JwtAuthGuard } from '@um/common/guards/jwt-auth.guard';
import { RolesGuard } from '@um/common/guards/roles.guard';
import { environment } from '@um/config/environment';
import { AuthModule } from '@um/modules/auth/auth.module';
import { UsersModule } from '@um/modules/users/users.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Apply the JwtAuthGuard globally
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Apply RolesGuard globally for role-based access control
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(environment.MONGODB_URI),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
