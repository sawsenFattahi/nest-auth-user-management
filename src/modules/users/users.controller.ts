import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@um/common/decorators/public.decorator';
import { Roles } from '@um/common/decorators/roles.decorator';
import { ROLE } from '@um/common/enums/role.enum';
import { CreateUserDto } from '@um/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@um/modules/users/dto/update-user.dto';
import { UserDto } from '@um/modules/users/dto/user.dto';
import { DeleteUserUseCase } from '@um/modules/users/use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from '@um/modules/users/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@um/modules/users/use-cases/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@um/modules/users/use-cases/register-user.use-case';
import { UpdateUserUseCase } from '@um/modules/users/use-cases/update-user.use-case';

import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiFindAllUsers,
  ApiGetOneUser,
  ApiUpdateUser,
} from './swagger';

@ApiTags('Users') // Group under "Users" in Swagger
@Controller('users')
export class UsersController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  /**
   * Create a new user
   * @param createUserDto - User details for creation
   * @returns The created user object
   */
  @Public()
  @Post()
  @ApiCreateUser()
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<UserDto>> {
    return this.registerUserUseCase.execute(createUserDto);
  }

  /**
   * Update current user's information
   * Accessible to both Admin and User roles.
   * @param req - Request object containing user details
   * @param updates - Partial user details to update
   * @returns The updated user object
   */
  @Roles(ROLE.USER, ROLE.ADMIN)
  @ApiUpdateUser()
  @Patch('me')
  async updateCurrentUser(
    @Req() req: any,
    @Body() updates: UpdateUserDto
  ): Promise<Partial<UserDto>> {
    return this.updateUserUseCase.execute(req?.user?.id, updates);
  }

  /**
   * Get a user by UID
   * Accessible to Admin role only.
   * @param uid - User ID
   * @returns The user object
   */
  @Roles(ROLE.ADMIN)
  @ApiGetOneUser()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserByIdUseCase.execute(id);
  }

  /**
   * Get a list of all users
   * Accessible to Admin role only.
   * @param filters - JSON string of filters
   * @param sort - JSON string for sorting
   * @returns List of users
   */
  @Roles(ROLE.ADMIN)
  @ApiFindAllUsers()
  @Get('')
  async findAll(
    @Query('filters') filters: string,
    @Query('sort') sort: string
  ): Promise<Partial<UserDto[]>> {
    return this.getAllUsersUseCase.execute({ filters, sort });
  }

  /**
   * Update a user by UID
   * Accessible to Admin role only.
   * @param uid - User ID
   * @param updateUserDto - Updated user details
   * @returns The updated user object
   */
  @Roles(ROLE.ADMIN)
  @ApiUpdateUser()
  @Patch(':id')
  async updateUserByAdmin(
    @Param('id') id: string,
    @Body() updates: UpdateUserDto
  ): Promise<Partial<UserDto>> {
    return this.updateUserUseCase.execute(id, updates);
  }

  /**
   * Delete a user by UID
   * Accessible to Admin role only.
   * @param id - User ID
   * @returns A confirmation message
   */
  @Roles(ROLE.ADMIN)
  @ApiDeleteUser()
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<Partial<UserDto>> {
    return this.deleteUserUseCase.execute(id);
  }
}
