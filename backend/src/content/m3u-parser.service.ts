import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ParsedM3uChannel {
  name: string;
  category: string;
  number: number;
  logo_url?: string;
  logo_emoji: string;
  now_playing: string;
  stream_url: string;
  is_hd: boolean;
}

@Injectable()
export class M3uParserService {
  private readonly logger = new Logger(M3uParserService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Procesa un texto en formato M3U o M3U8 y extrae canales organizados por categoría
   */
  parseM3uContent(m3uText: string): ParsedM3uChannel[] {
    const lines = m3uText.split(/\r?\n/);
    const channels: ParsedM3uChannel[] = [];

    let currentName = '';
    let currentLogo = '';
    let currentGroup = 'ARGENTINA';
    let currentChno = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('#EXTINF:')) {
        // Extraer atributos
        const nameMatch = line.match(/tvg-name="([^"]+)"/) || line.match(/,([^\n\r,]+)$/);
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const chnoMatch = line.match(/tvg-chno="([^"]+)"/);

        currentName = nameMatch ? nameMatch[1].trim() : 'Canal';
        currentLogo = logoMatch ? logoMatch[1].trim() : '';
        currentGroup = groupMatch ? groupMatch[1].trim().toUpperCase() : 'ARGENTINA';
        currentChno = chnoMatch ? parseFloat(chnoMatch[1]) : channels.length + 1;

        // Normalizar categoría
        if (currentGroup.includes('DEPORT') || currentGroup.includes('SPORT')) currentGroup = 'DEPORTES';
        else if (currentGroup.includes('NOTICIA') || currentGroup.includes('NEWS')) currentGroup = 'NOTICIAS';
        else if (currentGroup.includes('CINE') || currentGroup.includes('MOVIE')) currentGroup = 'CINE';
        else if (currentGroup.includes('INFANTIL') || currentGroup.includes('KIDS')) currentGroup = 'INFANTIL';
        else if (currentGroup.includes('DOCU')) currentGroup = 'DOCUMENTALES';
        else currentGroup = 'ARGENTINA';

      } else if (line.startsWith('http://') || line.startsWith('https://')) {
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

  /**
   * Importa masivamente una lista M3U a la base de datos Supabase
   */
  async importM3uToSupabase(m3uText: string) {
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
      } else {
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
}
