"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TvService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const link_tester_service_1 = require("./link-tester.service");
let TvService = TvService_1 = class TvService {
    constructor(prisma, linkTesterService) {
        this.prisma = prisma;
        this.linkTesterService = linkTesterService;
        this.logger = new common_1.Logger(TvService_1.name);
    }
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }
    async ensureSeedData() {
        const categoryCount = await this.prisma.category.count();
        if (categoryCount > 0)
            return;
        this.logger.log('Seeding initial TV categories and channels...');
        const defaultCategories = [
            { name: 'Argentina', slug: 'argentina', sort_order: 1 },
            { name: 'Deportes', slug: 'deportes', sort_order: 2 },
            { name: 'Noticias', slug: 'noticias', sort_order: 3 },
            { name: 'Cine', slug: 'cine', sort_order: 4 },
            { name: 'Infantil', slug: 'infantil', sort_order: 5 },
            { name: 'Música', slug: 'musica', sort_order: 6 },
            { name: 'Internacional', slug: 'internacional', sort_order: 7 },
            { name: 'Documentales', slug: 'documentales', sort_order: 8 },
        ];
        for (const cat of defaultCategories) {
            await this.prisma.category.create({
                data: {
                    name: cat.name,
                    slug: cat.slug,
                    sort_order: cat.sort_order,
                    is_active: true,
                },
            });
        }
        const argCat = await this.prisma.category.findUnique({ where: { slug: 'argentina' } });
        const depCat = await this.prisma.category.findUnique({ where: { slug: 'deportes' } });
        const cineCat = await this.prisma.category.findUnique({ where: { slug: 'cine' } });
        if (argCat) {
            const ch1 = await this.prisma.channel.create({
                data: {
                    name: 'Telefe HD',
                    category_id: argCat.id,
                    category_name: argCat.name,
                    number: 11.1,
                    logo_emoji: '📺',
                    description: 'Canal de televisión abierta argentina con programación variada.',
                    is_active: true,
                    sort_order: 1,
                },
            });
            await this.prisma.channelSource.createMany({
                data: [
                    {
                        channel_id: ch1.id,
                        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                        format: 'HLS',
                        is_active: true,
                        priority: 1,
                        last_status: 'WORKING',
                        last_http_code: 200,
                        last_response_time: 120,
                    },
                    {
                        channel_id: ch1.id,
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        format: 'MP4',
                        is_active: false,
                        priority: 2,
                        last_status: 'WORKING',
                        last_http_code: 200,
                        last_response_time: 210,
                    },
                ],
            });
        }
        if (depCat) {
            const ch2 = await this.prisma.channel.create({
                data: {
                    name: 'Deportes HD Premium',
                    category_id: depCat.id,
                    category_name: depCat.name,
                    number: 22.1,
                    logo_emoji: '⚽',
                    description: 'Transmisiones en vivo de fútbol, tenis y deportes mundiales.',
                    is_active: true,
                    sort_order: 1,
                },
            });
            await this.prisma.channelSource.create({
                data: {
                    channel_id: ch2.id,
                    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                    format: 'HLS',
                    is_active: true,
                    priority: 1,
                    last_status: 'WORKING',
                    last_http_code: 200,
                    last_response_time: 95,
                },
            });
        }
        if (cineCat) {
            const ch3 = await this.prisma.channel.create({
                data: {
                    name: 'Cine & Series HD',
                    category_id: cineCat.id,
                    category_name: cineCat.name,
                    number: 33.1,
                    logo_emoji: '🍿',
                    description: 'Películas de estreno 24/7 y series destacadas.',
                    is_active: true,
                    sort_order: 1,
                },
            });
            await this.prisma.channelSource.create({
                data: {
                    channel_id: ch3.id,
                    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                    format: 'MP4',
                    is_active: true,
                    priority: 1,
                    last_status: 'WORKING',
                    last_http_code: 200,
                    last_response_time: 180,
                },
            });
        }
        this.logger.log('Seed data successfully initialized.');
    }
    async getCategories() {
        await this.ensureSeedData();
        const categories = await this.prisma.category.findMany({
            orderBy: { sort_order: 'asc' },
            include: {
                _count: {
                    select: { channels: true },
                },
            },
        });
        return categories.map((c) => ({
            ...c,
            created_at: c.created_at.toISOString(),
            updated_at: c.updated_at.toISOString(),
            channel_count: c._count.channels,
        }));
    }
    async createCategory(dto) {
        const slug = dto.slug || this.slugify(dto.name);
        const existing = await this.prisma.category.findUnique({ where: { slug } });
        if (existing) {
            throw new common_1.BadRequestException(`Ya existe una categoría con el identificador / slug: "${slug}"`);
        }
        const category = await this.prisma.category.create({
            data: {
                name: dto.name,
                slug,
                image_url: dto.image_url || null,
                is_active: dto.is_active ?? true,
                sort_order: dto.sort_order ?? 0,
            },
        });
        return {
            ...category,
            created_at: category.created_at.toISOString(),
            updated_at: category.updated_at.toISOString(),
            channel_count: 0,
        };
    }
    async updateCategory(id, dto) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Categoría no encontrada.');
        }
        const slug = dto.slug || (dto.name ? this.slugify(dto.name) : category.slug);
        if (slug !== category.slug) {
            const existing = await this.prisma.category.findUnique({ where: { slug } });
            if (existing && existing.id !== id) {
                throw new common_1.BadRequestException(`El slug "${slug}" ya está en uso por otra categoría.`);
            }
        }
        const updated = await this.prisma.category.update({
            where: { id },
            data: {
                name: dto.name ?? category.name,
                slug,
                image_url: dto.image_url !== undefined ? dto.image_url : category.image_url,
                is_active: dto.is_active ?? category.is_active,
                sort_order: dto.sort_order ?? category.sort_order,
            },
        });
        return {
            ...updated,
            created_at: updated.created_at.toISOString(),
            updated_at: updated.updated_at.toISOString(),
        };
    }
    async deleteCategory(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Categoría no encontrada.');
        }
        await this.prisma.category.delete({ where: { id } });
        return { success: true, message: `Categoría "${category.name}" eliminada correctamente.` };
    }
    async getChannels(filters) {
        await this.ensureSeedData();
        const channels = await this.prisma.channel.findMany({
            include: {
                category: true,
                sources: {
                    orderBy: { priority: 'asc' },
                },
            },
            orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
        });
        let result = channels.map((ch) => {
            const sources = ch.sources.map((s) => ({
                ...s,
                format: s.format,
                last_status: s.last_status,
                created_at: s.created_at.toISOString(),
                updated_at: s.updated_at.toISOString(),
                last_checked_at: s.last_checked_at ? s.last_checked_at.toISOString() : null,
            }));
            const activeSource = sources.find((s) => s.is_active) || null;
            return {
                id: ch.id,
                name: ch.name,
                category_id: ch.category_id,
                category_name: ch.category?.name || ch.category_name || 'Sin Categoría',
                number: ch.number,
                logo_url: ch.logo_url,
                logo_emoji: ch.logo_emoji,
                description: ch.description,
                now_playing: ch.now_playing,
                stream_url: activeSource?.url || ch.stream_url || null,
                is_hd: ch.is_hd,
                is_active: ch.is_active,
                sort_order: ch.sort_order,
                created_at: ch.created_at.toISOString(),
                updated_at: ch.updated_at.toISOString(),
                sources,
                active_source: activeSource,
            };
        });
        if (filters?.search) {
            const query = filters.search.toLowerCase();
            result = result.filter((ch) => ch.name.toLowerCase().includes(query) ||
                ch.category_name.toLowerCase().includes(query) ||
                ch.id.toLowerCase().includes(query));
        }
        if (filters?.categoryId && filters.categoryId !== 'ALL') {
            result = result.filter((ch) => ch.category_id === filters.categoryId);
        }
        if (filters?.isActive !== undefined) {
            result = result.filter((ch) => ch.is_active === filters.isActive);
        }
        if (filters?.format && filters.format !== 'ALL') {
            result = result.filter((ch) => ch.sources.some((s) => s.format === filters.format));
        }
        if (filters?.hasErrors) {
            result = result.filter((ch) => ch.sources.some((s) => s.last_status === 'ERROR' || s.last_status === 'UNAVAILABLE'));
        }
        if (filters?.noSources) {
            result = result.filter((ch) => !ch.active_source);
        }
        return result;
    }
    async createChannel(dto) {
        let category = await this.prisma.category.findUnique({ where: { id: dto.category_id } });
        if (!category) {
            category = await this.prisma.category.findFirst({
                where: {
                    OR: [
                        { name: { equals: dto.category_id, mode: 'insensitive' } },
                        { slug: { equals: dto.category_id.toLowerCase(), mode: 'insensitive' } },
                    ],
                },
            });
        }
        if (!category) {
            category = await this.prisma.category.findFirst();
        }
        if (!category) {
            category = await this.prisma.category.create({
                data: {
                    name: 'General',
                    slug: 'general',
                    sort_order: 1,
                    is_active: true,
                },
            });
        }
        const initialUrl = dto.initial_source_url || dto.stream_url;
        const channel = await this.prisma.channel.create({
            data: {
                name: dto.name,
                category_id: category.id,
                category_name: category.name,
                logo_url: dto.logo_url || null,
                description: dto.description || null,
                is_active: dto.is_active ?? true,
                sort_order: dto.sort_order ?? 0,
            },
        });
        if (initialUrl) {
            await this.prisma.channelSource.create({
                data: {
                    channel_id: channel.id,
                    url: initialUrl,
                    format: dto.initial_source_format || this.linkTesterService.detectFormat(initialUrl),
                    is_active: true,
                    priority: 1,
                },
            });
        }
        return this.getChannelById(channel.id);
    }
    async getChannelById(id) {
        const channels = await this.getChannels();
        const ch = channels.find((c) => c.id === id);
        if (!ch)
            throw new common_1.NotFoundException('Canal no encontrado.');
        return ch;
    }
    async updateChannel(id, dto) {
        const channel = await this.prisma.channel.findUnique({ where: { id } });
        if (!channel)
            throw new common_1.NotFoundException('Canal no encontrado.');
        let categoryName = channel.category_name;
        if (dto.category_id && dto.category_id !== channel.category_id) {
            const category = await this.prisma.category.findUnique({ where: { id: dto.category_id } });
            if (!category)
                throw new common_1.BadRequestException('Categoría no válida.');
            categoryName = category.name;
        }
        await this.prisma.channel.update({
            where: { id },
            data: {
                name: dto.name ?? channel.name,
                category_id: dto.category_id ?? channel.category_id,
                category_name: categoryName,
                logo_url: dto.logo_url !== undefined ? dto.logo_url : channel.logo_url,
                description: dto.description !== undefined ? dto.description : channel.description,
                is_active: dto.is_active ?? channel.is_active,
                sort_order: dto.sort_order ?? channel.sort_order,
            },
        });
        return this.getChannelById(id);
    }
    async deleteChannel(id) {
        const channel = await this.prisma.channel.findUnique({ where: { id } });
        if (!channel)
            throw new common_1.NotFoundException('Canal no encontrado.');
        await this.prisma.channel.delete({ where: { id } });
        return { success: true, message: `Canal "${channel.name}" eliminado correctamente.` };
    }
    async addSource(dto, userId) {
        const channel = await this.prisma.channel.findUnique({ where: { id: dto.channel_id } });
        if (!channel)
            throw new common_1.BadRequestException('El canal especificado no existe.');
        const format = dto.format || this.linkTesterService.detectFormat(dto.url);
        const priority = dto.priority ?? 1;
        if (dto.is_active !== false && priority === 1) {
            await this.demoteExistingPriorityOne(dto.channel_id);
        }
        const source = await this.prisma.channelSource.create({
            data: {
                channel_id: dto.channel_id,
                url: dto.url,
                format,
                is_active: dto.is_active ?? true,
                priority,
                created_by_user_id: userId || null,
            },
        });
        await this.testAndStoreResult(source.id, source.url, source.format);
        return this.getChannelById(dto.channel_id);
    }
    async updateSource(id, dto) {
        const source = await this.prisma.channelSource.findUnique({ where: { id } });
        if (!source)
            throw new common_1.NotFoundException('Fuente de reproducción no encontrada.');
        const newPriority = dto.priority ?? source.priority;
        const newIsActive = dto.is_active ?? source.is_active;
        if (newIsActive && newPriority === 1) {
            await this.demoteExistingPriorityOne(source.channel_id, id);
        }
        await this.prisma.channelSource.update({
            where: { id },
            data: {
                url: dto.url ?? source.url,
                format: dto.format ?? source.format,
                is_active: newIsActive,
                priority: newPriority,
            },
        });
        return this.getChannelById(source.channel_id);
    }
    async quickSwitchSource(dto, userId) {
        const channel = await this.prisma.channel.findUnique({ where: { id: dto.channel_id } });
        if (!channel)
            throw new common_1.BadRequestException('El canal no existe.');
        const format = dto.format || this.linkTesterService.detectFormat(dto.url);
        await this.demoteExistingPriorityOne(dto.channel_id);
        const newSource = await this.prisma.channelSource.create({
            data: {
                channel_id: dto.channel_id,
                url: dto.url,
                format,
                is_active: true,
                priority: 1,
                created_by_user_id: userId || null,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                user_id: userId || null,
                action: 'QUICK_SOURCE_SWITCH',
                details: `Cambio rápido de fuente para el canal ${channel.name} -> Nueva URL: ${dto.url}`,
            },
        });
        await this.testAndStoreResult(newSource.id, newSource.url, format);
        return this.getChannelById(dto.channel_id);
    }
    async demoteExistingPriorityOne(channelId, excludeSourceId) {
        const existingP1 = await this.prisma.channelSource.findMany({
            where: {
                channel_id: channelId,
                priority: 1,
                id: excludeSourceId ? { not: excludeSourceId } : undefined,
            },
        });
        for (const s of existingP1) {
            await this.prisma.channelSource.update({
                where: { id: s.id },
                data: { priority: s.priority + 1 },
            });
        }
    }
    async deleteSource(id) {
        const source = await this.prisma.channelSource.findUnique({ where: { id } });
        if (!source)
            throw new common_1.NotFoundException('Fuente no encontrada.');
        await this.prisma.channelSource.delete({ where: { id } });
        return this.getChannelById(source.channel_id);
    }
    async testLink(dto) {
        const result = await this.linkTesterService.testLink(dto.url, dto.format);
        if (dto.source_id) {
            await this.prisma.channelSource.update({
                where: { id: dto.source_id },
                data: {
                    last_checked_at: new Date(result.checked_at),
                    last_status: result.status,
                    last_http_code: result.http_code,
                    last_response_time: result.response_time_ms,
                    last_error_message: result.error_message || null,
                },
            });
        }
        return result;
    }
    async testAndStoreResult(sourceId, url, format) {
        const result = await this.linkTesterService.testLink(url, format);
        await this.prisma.channelSource.update({
            where: { id: sourceId },
            data: {
                last_checked_at: new Date(result.checked_at),
                last_status: result.status,
                last_http_code: result.http_code,
                last_response_time: result.response_time_ms,
                last_error_message: result.error_message || null,
            },
        });
        return result;
    }
    async getStats() {
        await this.ensureSeedData();
        const categoriesCount = await this.prisma.category.count();
        const channels = await this.prisma.channel.findMany({
            include: { sources: true },
        });
        const totalChannels = channels.length;
        const activeChannels = channels.filter((c) => c.is_active).length;
        const inactiveChannels = totalChannels - activeChannels;
        const channelsWithoutSource = channels.filter((c) => !c.sources.some((s) => s.is_active)).length;
        const allSources = await this.prisma.channelSource.findMany();
        const workingSources = allSources.filter((s) => s.last_status === 'WORKING').length;
        const errorSources = allSources.filter((s) => s.last_status === 'ERROR' || s.last_status === 'UNAVAILABLE').length;
        return {
            total_categories: categoriesCount,
            total_channels: totalChannels,
            active_channels: activeChannels,
            inactive_channels: inactiveChannels,
            channels_without_source: channelsWithoutSource,
            working_sources: workingSources,
            error_sources: errorSources,
        };
    }
    async getLiveFeed() {
        await this.ensureSeedData();
        const categories = await this.prisma.category.findMany({
            where: { is_active: true },
            orderBy: { sort_order: 'asc' },
            include: {
                channels: {
                    where: { is_active: true },
                    orderBy: { sort_order: 'asc' },
                    include: {
                        sources: {
                            where: { is_active: true },
                            orderBy: { priority: 'asc' },
                        },
                    },
                },
            },
        });
        return categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            image_url: cat.image_url,
            sort_order: cat.sort_order,
            channels: cat.channels.map((ch) => {
                const topSource = ch.sources[0] || null;
                return {
                    id: ch.id,
                    name: ch.name,
                    logo_url: ch.logo_url,
                    logo_emoji: ch.logo_emoji,
                    description: ch.description,
                    sort_order: ch.sort_order,
                    active_source: topSource
                        ? {
                            id: topSource.id,
                            url: topSource.url,
                            format: topSource.format,
                            priority: topSource.priority,
                        }
                        : null,
                };
            }),
        }));
    }
};
exports.TvService = TvService;
exports.TvService = TvService = TvService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        link_tester_service_1.LinkTesterService])
], TvService);
//# sourceMappingURL=tv.service.js.map