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
var M3uParserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.M3uParserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let M3uParserService = M3uParserService_1 = class M3uParserService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(M3uParserService_1.name);
    }
    parseM3uContent(m3uText) {
        const lines = m3uText.split(/\r?\n/);
        const channels = [];
        let currentName = '';
        let currentLogo = '';
        let currentGroup = 'ARGENTINA';
        let currentChno = 1;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('#EXTINF:')) {
                const nameMatch = line.match(/tvg-name="([^"]+)"/) || line.match(/,([^\n\r,]+)$/);
                const logoMatch = line.match(/tvg-logo="([^"]+)"/);
                const groupMatch = line.match(/group-title="([^"]+)"/);
                const chnoMatch = line.match(/tvg-chno="([^"]+)"/);
                currentName = nameMatch ? nameMatch[1].trim() : 'Canal';
                currentLogo = logoMatch ? logoMatch[1].trim() : '';
                currentGroup = groupMatch ? groupMatch[1].trim().toUpperCase() : 'ARGENTINA';
                currentChno = chnoMatch ? parseFloat(chnoMatch[1]) : channels.length + 1;
                if (currentGroup.includes('DEPORT') || currentGroup.includes('SPORT'))
                    currentGroup = 'DEPORTES';
                else if (currentGroup.includes('NOTICIA') || currentGroup.includes('NEWS'))
                    currentGroup = 'NOTICIAS';
                else if (currentGroup.includes('CINE') || currentGroup.includes('MOVIE'))
                    currentGroup = 'CINE';
                else if (currentGroup.includes('INFANTIL') || currentGroup.includes('KIDS'))
                    currentGroup = 'INFANTIL';
                else if (currentGroup.includes('DOCU'))
                    currentGroup = 'DOCUMENTALES';
                else
                    currentGroup = 'ARGENTINA';
            }
            else if (line.startsWith('http://') || line.startsWith('https://')) {
                if (currentName) {
                    channels.push({
                        name: currentName.replace(/Ⓨ|Ⓖ/g, '').trim(),
                        category: currentGroup,
                        number: currentChno,
                        logo_url: currentLogo || undefined,
                        logo_emoji: currentGroup === 'DEPORTES' ? '🏆' : currentGroup === 'NOTICIAS' ? '📰' : currentGroup === 'CINE' ? '🎬' : '📺',
                        now_playing: 'Transmisión en Vivo HD',
                        stream_url: line,
                        is_hd: line.includes('hd') || currentName.toLowerCase().includes('hd') || true,
                    });
                    currentName = '';
                }
            }
        }
        return channels;
    }
    async importM3uToSupabase(m3uText) {
        const channels = this.parseM3uContent(m3uText);
        this.logger.log(`Procesando ${channels.length} canales extraídos de M3U...`);
        let importedCount = 0;
        for (const ch of channels) {
            const existing = await this.prisma.channel.findFirst({
                where: { name: ch.name },
            });
            if (!existing) {
                await this.prisma.channel.create({
                    data: {
                        name: ch.name,
                        category_name: ch.category,
                        number: ch.number,
                        logo_url: ch.logo_url,
                        logo_emoji: ch.logo_emoji,
                        now_playing: ch.now_playing,
                        stream_url: ch.stream_url,
                        is_hd: ch.is_hd,
                        is_active: true,
                    },
                });
                importedCount++;
            }
            else {
                await this.prisma.channel.update({
                    where: { id: existing.id },
                    data: {
                        stream_url: ch.stream_url,
                        logo_url: ch.logo_url || existing.logo_url,
                    },
                });
            }
        }
        return {
            total_found: channels.length,
            imported: importedCount,
            message: `Se importaron ${importedCount} canales nuevos a la base de datos de Supabase.`,
        };
    }
};
exports.M3uParserService = M3uParserService;
exports.M3uParserService = M3uParserService = M3uParserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], M3uParserService);
//# sourceMappingURL=m3u-parser.service.js.map