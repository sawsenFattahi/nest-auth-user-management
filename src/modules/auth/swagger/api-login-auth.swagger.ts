import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiLoginAuth = () =>
  applyDecorators(
    ApiOperation({ summary: 'Login a user' }),
    ApiBody({
      type: Object,
      examples: {
        example1: {
          summary: 'Valid login request',
          value: {
            username: 'john_doe',
            password: 'password123',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'User logged in successfully.',
      schema: {
        example: {
          access_token: 'jwt-token',
        },
      },
    })
  );
