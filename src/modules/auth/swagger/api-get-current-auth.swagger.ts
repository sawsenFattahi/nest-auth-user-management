import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiGetCurrentAuth = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get current user' }),
    ApiResponse({
      status: 200,
      description: 'Details of the current user.',
      schema: {
        example: {
          id: '123',
          username: 'john_doe',
          role: 'USER',
        },
      },
    }),
    ApiBearerAuth()
  );
