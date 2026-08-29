import { Controller, Get, Param } from '@nestjs/common';
import { PlansService } from './plans.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Public()
  @Get()
  async getPlans() {
    return this.plansService.findAll();
  }

  @Public()
  @Get(':code')
  async getPlanByCode(@Param('code') code: string) {
    return this.plansService.findByCode(code.toUpperCase());
  }
}
