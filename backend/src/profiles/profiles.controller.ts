import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async createProfile(@Request() req: any, @Body() dto: CreateProfileDto) {
    return this.profilesService.createProfile(req.user.id, dto);
  }

  @Get()
  async getMyProfiles(@Request() req: any) {
    return this.profilesService.findMyProfiles(req.user.id);
  }

  @Put(':id')
  async updateProfile(@Request() req: any, @Param('id') profileId: string, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateProfile(req.user.id, profileId, dto);
  }

  @Delete(':id')
  async removeProfile(@Request() req: any, @Param('id') profileId: string) {
    return this.profilesService.removeProfile(req.user.id, profileId);
  }
}
