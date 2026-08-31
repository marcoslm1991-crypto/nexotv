import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesService {
    private prisma;
    constructor(prisma: PrismaService);
    createProfile(userId: string, dto: CreateProfileDto): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        avatar_url: string | null;
    }>;
    findMyProfiles(userId: string): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        avatar_url: string | null;
    }[]>;
    updateProfile(userId: string, profileId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        avatar_url: string | null;
    }>;
    removeProfile(userId: string, profileId: string): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        avatar_url: string | null;
    }>;
}
