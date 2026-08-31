"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
let ContentService = class ContentService {
    constructor() {
        this.userProgressMap = new Map();
    }
    async saveProgress(userId, dto) {
        const key = `${userId}:${dto.profile_id}:${dto.content_id}`;
        this.userProgressMap.set(key, {
            progress_seconds: dto.progress_seconds,
            duration_seconds: dto.duration_seconds,
            updated_at: new Date(),
        });
        return { success: true, key, progress: dto.progress_seconds };
    }
    async getProgress(userId, profileId, contentId) {
        const key = `${userId}:${profileId}:${contentId}`;
        const data = this.userProgressMap.get(key);
        if (!data)
            return { progress_seconds: 0, duration_seconds: 0 };
        return data;
    }
    async getChannels() {
        return [
            {
                id: 'ch-1',
                number: 1,
                name: 'Deportes HD',
                category: 'Deportes',
                logo_url: 'https://via.placeholder.com/100?text=Deportes',
                stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                epg: {
                    title: 'Real Madrid vs Barcelona',
                    start_time: '14:00',
                    end_time: '16:00',
                    description: 'Gran Clásico del fútbol español en vivo en alta definición.',
                    next_program: {
                        title: 'Resumen de la Fecha',
                        start_time: '16:00',
                    },
                },
            },
            {
                id: 'ch-2',
                number: 2,
                name: 'Canal 13 Argentina',
                category: 'Canales Argentina',
                logo_url: 'https://via.placeholder.com/100?text=Canal13',
                stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                epg: {
                    title: 'Noticiero Trece',
                    start_time: '13:00',
                    end_time: '14:30',
                    description: 'Noticias en vivo y cobertura especial.',
                    next_program: {
                        title: 'Almorzando con los Notables',
                        start_time: '14:30',
                    },
                },
            },
            {
                id: 'ch-3',
                number: 3,
                name: 'Cine Premium',
                category: 'Películas',
                logo_url: 'https://via.placeholder.com/100?text=Cine',
                stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                epg: {
                    title: 'Misión Imposible: Sentencia Mortal',
                    start_time: '15:00',
                    end_time: '17:40',
                    description: 'Ethan Hunt y su equipo se enfrentan a su misión más peligrosa.',
                    next_program: {
                        title: 'Gladiador II',
                        start_time: '17:40',
                    },
                },
            },
        ];
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)()
], ContentService);
//# sourceMappingURL=content.service.js.map