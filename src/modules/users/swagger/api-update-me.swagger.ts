import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UpdateUserDto } from '@um/modules/users/dto/update-user.dto';

export const ApiUpdateMe = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update current user' }),
    ApiBearerAuth(),
    ApiBody({
      type: UpdateUserDto,
      examples: {
        example1: {
          summary: 'Valid update request',
          value: {
            name: 'Updated Name',
            address: { city: 'San Francisco', zip: '94105' },
            comment: 'Updated comment',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'The user has been successfully updated.',
      schema: {
        example: {
          uid: '123',
          username: 'john_doe',
          role: 'user',
        },
      },
    })
  );
