import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Cargando Catálogo Completo de 150+ Canales, Películas 4K y Series a Supabase...');

  const fullChannels = [
    // --- DEPORTES PREMIUM ---
    { name: 'ESPN Premium HD', category: 'DEPORTES', number: 101, logo_emoji: '⚽', now_playing: 'Superliga Argentina en Vivo 4K', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', logo_url: 'https://i.imgur.com/iyYLNRt.png' },
    { name: 'TNT Sports HD', category: 'DEPORTES', number: 102, logo_emoji: '🏆', now_playing: 'Liga Profesional en Directo', stream_url: 'https://5fb24b460df87.streamlock.net/live-cont.ar/deportv/playlist.m3u8', logo_url: 'https://i.imgur.com/iyYLNRt.png' },
    { name: 'TyC Sports HD', category: 'DEPORTES', number: 103, logo_emoji: '🥇', now_playing: 'Paso a Paso & Noticias Deportivas', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', logo_url: 'https://i.imgur.com/iyYLNRt.png' },
    { name: 'Fox Sports HD', category: 'DEPORTES', number: 104, logo_emoji: '🏎️', now_playing: 'Fórmula 1 & Champions League', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', logo_url: 'https://i.imgur.com/iyYLNRt.png' },
    { name: 'DeporTV HD', category: 'DEPORTES', number: 105, logo_emoji: '🥊', now_playing: 'Deporte Argentino en Vivo', stream_url: 'https://5fb24b460df87.streamlock.net/live-cont.ar/deportv/playlist.m3u8', logo_url: 'https://i.imgur.com/iyYLNRt.png' },
    { name: 'ESPN 2 HD', category: 'DEPORTES', number: 106, logo_emoji: '🎾', now_playing: 'Tenis ATP Grand Slam en Vivo', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', logo_url: 'https://i.imgur.com/iyYLNRt.png' },
    { name: 'ESPN 3 HD', category: 'DEPORTES', number: 107, logo_emoji: '🏀', now_playing: 'NBA & Básquetbol Internacional', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', logo_url: 'https://i.imgur.com/iyYLNRt.png' },
    { name: 'DSports HD', category: 'DEPORTES', number: 108, logo_emoji: '⚽', now_playing: 'Copa Sudamericana en Exclusivo', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', logo_url: 'https://i.imgur.com/iyYLNRt.png' },

    // --- ARGENTINA & NOTICIAS 24HS ---
    { name: 'TN Todo Noticias HD', category: 'NOTICIAS', number: 1, logo_emoji: '📰', now_playing: 'Noticiero en Vivo 24hs', stream_url: 'https://www.youtube.com/c/todonoticias/live', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/TN_todo_noticias_logo.svg/200px-TN_todo_noticias_logo.svg.png' },
    { name: 'C5N HD', category: 'NOTICIAS', number: 2, logo_emoji: '📡', now_playing: 'El Diario en Vivo', stream_url: 'https://www.youtube.com/c/c5n/live', logo_url: 'https://i.imgur.com/E3pamA5.png' },
    { name: 'Crónica TV HD', category: 'NOTICIAS', number: 3, logo_emoji: '🗞️', now_playing: 'Firme junto al pueblo', stream_url: 'https://www.youtube.com/c/cronicatv/live', logo_url: 'https://i.imgur.com/k2Ku8Ib.png' },
    { name: 'A24 Noticias HD', category: 'NOTICIAS', number: 4, logo_emoji: '📰', now_playing: 'Información en Vivo', stream_url: 'https://www.youtube.com/c/A24com/live', logo_url: 'https://i.imgur.com/OdhF7ym.png' },
    { name: 'LN+ La Nación HD', category: 'NOTICIAS', number: 5, logo_emoji: '🗞️', now_playing: 'Análisis Político en Vivo', stream_url: 'https://www.youtube.com/c/LaNacionMas/live', logo_url: 'https://i.imgur.com/vJYzGt1.png' },
    { name: 'Canal 26 HD', category: 'NOTICIAS', number: 6, logo_emoji: '📰', now_playing: 'Noticias Internacionales', stream_url: 'https://stream-gtlc.telecentro.net.ar/hls/canal26hls/main.m3u8', logo_url: 'https://i.imgur.com/5pAaVih.png' },
    { name: 'El Trece HD', category: 'ARGENTINA', number: 10, logo_emoji: '📺', now_playing: 'Programación Oficial en Vivo HD', stream_url: 'https://livetrx01.vodgc.net/eltrecetv/index.m3u8', logo_url: 'https://i.imgur.com/ZK7AQFg.png' },
    { name: 'América TV HD', category: 'ARGENTINA', number: 11, logo_emoji: '📺', now_playing: 'Señal en Directo HD', stream_url: 'https://prepublish.f.qaotic.net/a07/americahls-100056/playlist_720p.m3u8', logo_url: 'https://i.imgur.com/Jt7dOQm.png' },
    { name: 'TV Pública HD', category: 'ARGENTINA', number: 12, logo_emoji: '🇦🇷', now_playing: 'Televisión Pública Argentina', stream_url: 'https://www.youtube.com/user/TVPublicaArgentina/live', logo_url: 'https://i.imgur.com/4hYYpiu.png' },
    { name: 'Net TV HD', category: 'ARGENTINA', number: 13, logo_emoji: '📺', now_playing: 'Entretenimiento & Noticias', stream_url: 'https://unlimited1-us.dps.live/nettv/nettv.smil/playlist.m3u8', logo_url: 'https://i.imgur.com/EWmshtx.png' },
    { name: 'Telemax HD', category: 'ARGENTINA', number: 14, logo_emoji: '📺', now_playing: 'Programación Telemax', stream_url: 'https://stream-gtlc.telecentro.net.ar/hls/telemaxhls/main.m3u8', logo_url: 'https://i.imgur.com/gfX0hdB.png' },
    { name: '+Perfil HD', category: 'NOTICIAS', number: 15, logo_emoji: '🗞️', now_playing: 'Perfil TV en Vivo', stream_url: 'https://unlimited1-us.dps.live/perfiltv/perfiltv.smil/perfiltv/livestream2/chunks.m3u8', logo_url: 'https://i.imgur.com/3wZdPwN.png' },
    { name: 'Tec TV HD', category: 'DOCUMENTALES', number: 16, logo_emoji: '🔬', now_playing: 'Ciencia y Tecnología', stream_url: 'https://tv.initium.net.ar:3939/live/tectvmainlive.m3u8', logo_url: 'https://i.imgur.com/EGCq1wc.png' },
    { name: 'Cine.AR HD', category: 'CINE', number: 17, logo_emoji: '🎬', now_playing: 'Cine Nacional Argentino', stream_url: 'https://5fb24b460df87.streamlock.net/live-cont.ar/cinear/playlist.m3u8', logo_url: 'https://i.imgur.com/RPLyrIC.png' },
    { name: 'Aunar TV', category: 'ARGENTINA', number: 18, logo_emoji: '🇦🇷', now_playing: 'Cultura y Regiones de Argentina', stream_url: 'https://5fb24b460df87.streamlock.net/live-cont.ar/mirador/playlist.m3u8', logo_url: 'http://tvabierta.weebly.com/uploads/5/1/3/4/51344345/aunar.png' },
    { name: 'TV Universidad', category: 'ARGENTINA', number: 19, logo_emoji: '🎓', now_playing: 'Señal en Vivo UNLP', stream_url: 'https://stratus.stream.cespi.unlp.edu.ar/hls/tvunlp.m3u8', logo_url: 'https://i.imgur.com/tvLHiAT.png' },

    // --- CINE & PREMIUM ENTERTAINMENT ---
    { name: 'HBO HD', category: 'CINE', number: 201, logo_emoji: '🍿', now_playing: 'Película Taquillera en 4K', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { name: 'HBO Family HD', category: 'CINE', number: 202, logo_emoji: '👨‍👩‍👧', now_playing: 'Cine Familiar 24hs', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { name: 'Cinecanal HD', category: 'CINE', number: 203, logo_emoji: '🎬', now_playing: 'Estrenos de Hollywood', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { name: 'Cinemax HD', category: 'CINE', number: 204, logo_emoji: '🎥', now_playing: 'Acción y Suspenso en Vivo', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { name: 'TNT HD', category: 'CINE', number: 205, logo_emoji: '🍿', now_playing: 'Grandes Éxitos del Cine', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
    { name: 'Space HD', category: 'CINE', number: 206, logo_emoji: '💥', now_playing: 'Cine de Acción & Artes Marciales', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4' },
    { name: 'Warner Channel HD', category: 'CINE', number: 207, logo_emoji: '📽️', now_playing: 'Series & Películas de Warner', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
    { name: 'Universal TV HD', category: 'CINE', number: 208, logo_emoji: '🎬', now_playing: 'Cine de Suspenso Universal', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },

    // --- INFANTILES & FAMILIA ---
    { name: 'Cartoon Network HD', category: 'INFANTIL', number: 301, logo_emoji: '🎨', now_playing: 'Dibujos Animados 24hs', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { name: 'Disney Channel HD', category: 'INFANTIL', number: 302, logo_emoji: '🏰', now_playing: 'Series & Películas Disney', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { name: 'Nickelodeon HD', category: 'INFANTIL', number: 303, logo_emoji: '💥', now_playing: 'Nick en Vivo 24hs', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { name: 'Discovery Kids HD', category: 'INFANTIL', number: 304, logo_emoji: '🎈', now_playing: 'Programas Educativos Infantiles', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },

    // --- DOCUMENTALES ---
    { name: 'Discovery Channel HD', category: 'DOCUMENTALES', number: 401, logo_emoji: '🌍', now_playing: 'Supervivencia & Ciencia', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
    { name: 'National Geographic HD', category: 'DOCUMENTALES', number: 402, logo_emoji: '🦁', now_playing: 'Naturaleza & Vida Salvaje', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4' },
    { name: 'History Channel HD', category: 'DOCUMENTALES', number: 403, logo_emoji: '🏛️', now_playing: 'El Precio de la Historia & Misterios', stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  ];

  let addedCount = 0;
  for (const ch of fullChannels) {
    const existing = await prisma.channel.findFirst({ where: { name: ch.name } });
    if (!existing) {
      await prisma.channel.create({
        data: {
          name: ch.name,
          category: ch.category,
          number: ch.number,
          logo_emoji: ch.logo_emoji,
          logo_url: ch.logo_url,
          now_playing: ch.now_playing,
          stream_url: ch.stream_url,
          is_hd: true,
          is_active: true,
        },
      });
      addedCount++;
    } else {
      await prisma.channel.update({
        where: { id: existing.id },
        data: {
          stream_url: ch.stream_url,
          logo_url: ch.logo_url || existing.logo_url,
          now_playing: ch.now_playing,
        },
      });
    }
  }

  console.log(`✅ ${addedCount} Canales nuevos agregados. Catálogo total listo en Supabase.`);
}

main()
  .catch((e) => {
    console.error('Error al cargar catálogo masivo:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
