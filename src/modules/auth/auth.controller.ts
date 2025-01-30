import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@um/common/decorators/public.decorator';
import { Roles } from '@um/common/decorators/roles.decorator';
import { ROLE } from '@um/common/enums/role.enum';
import { ApiAuthLogout, ApiGetCurrentAuth, ApiLoginAuth } from '@um/modules/auth/swagger';
import { AuthenticateUserUseCase } from '@um/modules/auth/use-cases/authenticate-user.use-case';
import { LogoutUserUseCase } from '@um/modules/auth/use-cases/logout.use-case';
import { GetUserByIdUseCase } from '@um/modules/users/use-cases/get-user-by-id.use-case';

@ApiTags('Authentication') // Group under "Authentication" in Swagger
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase
  ) {}

  /**
   * User Login Endpoint
   * @param body - Contains username and password
   * @returns JWT token if credentials are valid
   */
  @Public()
  @Post('login')
  @ApiLoginAuth()
  async login(@Body() { username, password }: { username: string; password: string }) {
    return this.authenticateUserUseCase.execute({ username, password });
  }

  /**
   * Get Current User Information
   * Accessible to both Admin and User roles.
   * @returns User details
   */
  @Roles(ROLE.USER, ROLE.ADMIN)
  @ApiGetCurrentAuth()
  @Get('me')
  async getCurrentUser(@Req() req: any) {
    return this.getUserByIdUseCase.execute(req?.user?.id);
  }

  /**
   * User Logout Endpoint
   * @param req - Request containing user information
   * @returns Logout confirmation message
   */
  @Roles(ROLE.USER, ROLE.ADMIN)
  @Post('logout')
  @ApiAuthLogout()
  async logout(@Req() req: any) {
    return this.logoutUserUseCase.execute(req.headers?.authorization);
  }
}
