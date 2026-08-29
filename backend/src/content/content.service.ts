import { Injectable } from '@nestjs/common';
import { SaveProgressDto } from './dto/save-progress.dto';

export interface EpgProgram {
  title: string;
  start_time: string;
  end_time: string;
  description: string;
  next_program?: {
    title: string;
    start_time: string;
  };
}

export interface Channel {
  id: string;
  number: number;
  name: string;
  category: string;
  logo_url: string;
  stream_url: string;
  epg: EpgProgram;
}

@Injectable()
export class ContentService {
  private userProgressMap = new Map<string, { progress_seconds: number; duration_seconds: number; updated_at: Date }>();

  async saveProgress(userId: string, dto: SaveProgressDto) {
    const key = `${userId}:${dto.profile_id}:${dto.content_id}`;
    this.userProgressMap.set(key, {
      progress_seconds: dto.progress_seconds,
      duration_seconds: dto.duration_seconds,
      updated_at: new Date(),
    });
    return { success: true, key, progress: dto.progress_seconds };
  }

  async getProgress(userId: string, profileId: string, contentId: string) {
    const key = `${userId}:${profileId}:${contentId}`;
    const data = this.userProgressMap.get(key);
    if (!data) return { progress_seconds: 0, duration_seconds: 0 };
    return data;
  }

  async getChannels(): Promise<Channel[]> {
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
}
