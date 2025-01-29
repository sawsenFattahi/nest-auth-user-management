import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiAuthLogout = () =>
  applyDecorators(
    ApiOperation({ summary: 'Logout a user' }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'User logged out successfully.',
    })
  );
