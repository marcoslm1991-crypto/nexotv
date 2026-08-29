import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.plan.findMany({
      where: { is_active: true },
      orderBy: { max_screens: 'asc' },
    });
  }

  async findByCode(code: string) {
    return this.prisma.plan.findUnique({
      where: { code },
    });
  }
}
