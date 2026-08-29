import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { RenewSubscriptionDto } from './dto/renew-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('subscriptions')
@UseGuards(RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Roles(UserRole.ADMIN)
  @Post('renew')
  async renewSubscription(@Body() dto: RenewSubscriptionDto) {
    return this.subscriptionsService.renewSubscription(dto);
  }

  @Roles(UserRole.ADMIN)
  @Post('change-plan')
  async changePlan(@Body() dto: ChangePlanDto) {
    return this.subscriptionsService.changePlan(dto);
  }

  @Roles(UserRole.ADMIN)
  @Get('history/:user_id')
  async getHistory(@Param('user_id') userId: string) {
    return this.subscriptionsService.getHistory(userId);
  }
}
