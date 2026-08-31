import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    createProfile(req: any, dto: CreateProfileDto): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        avatar_url: string | null;
    }>;
    getMyProfiles(req: any): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        avatar_url: string | null;
    }[]>;
    updateProfile(req: any, profileId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        avatar_url: string | null;
    }>;
    removeProfile(req: any, profileId: string): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        avatar_url: string | null;
    }>;
}
