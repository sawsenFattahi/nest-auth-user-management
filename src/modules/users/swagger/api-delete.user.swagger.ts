import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiDeleteUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a user' }),
    ApiResponse({
      status: 200,
      description: 'The user has been successfully deleted.',
      schema: {
        example: {
          username: 'john_doe',
          name: 'John Doe',
          role: 'ADMIN',
        },
      },
    }),
    ApiBearerAuth()
  );
