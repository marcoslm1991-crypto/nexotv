import { PrismaService } from '../prisma/prisma.service';
export declare class PlansService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        code: string;
        max_screens: number;
        max_profiles: number;
        description: string | null;
    }[]>;
    findByCode(code: string): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        code: string;
        max_screens: number;
        max_profiles: number;
        description: string | null;
    } | null>;
}
