import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiGetOneUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Find a user by UID' }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Details of the user with the given UID.',
      schema: {
        example: {
          id: '456',
          name: 'Jane Doe',
          role: 'ADMIN',
        },
      },
    })
  );
