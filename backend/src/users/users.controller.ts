import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole, SubscriptionStatus } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Public()
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: SubscriptionStatus,
    @Query('plan_code') plan_code?: string,
  ) {
    return this.usersService.findAll({ search, status, plan_code });
  }

  @Get('me')
  async getMyProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
