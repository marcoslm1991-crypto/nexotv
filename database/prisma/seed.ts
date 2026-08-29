import { PrismaClient, UserRole, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando base de datos inicial en Supabase...');

  // 1. Crear Planes
  const planFamiliar = await prisma.plan.upsert({
    where: { code: 'FAMILIAR' },
    update: {},
    create: {
      name: 'Plan Familiar 4K',
      code: 'FAMILIAR',
      max_screens: 3,
      max_profiles: 3,
      description: 'Acceso completo en hasta 3 dispositivos en simultáneo',
    },
  });

  await prisma.plan.upsert({
    where: { code: 'INDIVIDUAL' },
    update: {},
    create: {
      name: 'Plan Individual HD',
      code: 'INDIVIDUAL',
      max_screens: 1,
      max_profiles: 1,
      description: 'Acceso en 1 pantalla',
    },
  });

  console.log('✅ Planes creados.');

  // 2. Crear Usuario Cliente Demo (MARCOS01 / 1234)
  const userMarcos = await prisma.user.upsert({
    where: { alias: 'MARCOS01' },
    update: {},
    create: {
      alias: 'MARCOS01',
      name: 'Marcos',
      password_hash: '1234',
      role: UserRole.CLIENT,
    },
  });

  // Crear suscripción activa (vence en 3 días para coincidir con la UI)
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + 3);

  const existingSub = await prisma.subscription.findFirst({
    where: { user_id: userMarcos.id },
  });

  if (!existingSub) {
    await prisma.subscription.create({
      data: {
        user_id: userMarcos.id,
        plan_id: planFamiliar.id,
        start_date: now,
        end_date: endDate,
        status: SubscriptionStatus.VIGENTE,
      },
    });
  }

  // Perfiles de Marcos
  const existingProfiles = await prisma.profile.findMany({ where: { user_id: userMarcos.id } });
  if (existingProfiles.length === 0) {
    await prisma.profile.createMany({
      data: [
        { user_id: userMarcos.id, name: 'Perfil Principal' },
        { user_id: userMarcos.id, name: 'Familia' },
        { user_id: userMarcos.id, name: 'Niños' },
      ],
    });
  }

  // 3. Usuario Administrador
  await prisma.user.upsert({
    where: { alias: 'admin' },
    update: {},
    create: {
      alias: 'admin',
      name: 'Administrador NexoTV',
      password_hash: 'admin123',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Usuarios y Suscripciones creadas.');

  // 4. Sembrar Canales de TV en Vivo Reales
  const channels = [
    {
      name: 'TN Todo Noticias HD',
      category: 'NOTICIAS',
      number: 24.3,
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/TN_todo_noticias_logo.svg/200px-TN_todo_noticias_logo.svg.png',
      logo_emoji: '📰',
      now_playing: 'Noticiero en Vivo 24hs HD',
      stream_url: 'https://www.youtube.com/c/todonoticias/live',
      is_hd: true,
    },
    {
      name: 'C5N HD',
      category: 'NOTICIAS',
      number: 25.2,
      logo_url: 'https://i.imgur.com/E3pamA5.png',
      logo_emoji: '📡',
      now_playing: 'El Diario en Vivo',
      stream_url: 'https://www.youtube.com/c/c5n/live',
      is_hd: true,
    },
    {
      name: 'El Trece HD',
      category: 'ARGENTINA',
      number: 33.1,
      logo_url: 'https://i.imgur.com/ZK7AQFg.png',
      logo_emoji: '📺',
      now_playing: 'Transmisión Oficial en Vivo HD',
      stream_url: 'https://livetrx01.vodgc.net/eltrecetv/index.m3u8',
      is_hd: true,
    },
    {
      name: 'DeporTV HD',
      category: 'DEPORTES',
      number: 24.1,
      logo_url: 'https://i.imgur.com/iyYLNRt.png',
      logo_emoji: '🏆',
      now_playing: 'Deportes Argentina en Vivo',
      stream_url: 'https://5fb24b460df87.streamlock.net/live-cont.ar/deportv/playlist.m3u8',
      is_hd: true,
    },
    {
      name: 'Cine.AR HD',
      category: 'CINE',
      number: 22.4,
      logo_url: 'https://i.imgur.com/RPLyrIC.png',
      logo_emoji: '🎬',
      now_playing: 'Cine Nacional Argentino en Vivo',
      stream_url: 'https://5fb24b460df87.streamlock.net/live-cont.ar/cinear/playlist.m3u8',
      is_hd: true,
    },
    {
      name: 'Canal 26 HD',
      category: 'NOTICIAS',
      number: 24.2,
      logo_url: 'https://i.imgur.com/5pAaVih.png',
      logo_emoji: '📰',
      now_playing: 'Noticias 24hs en Vivo',
      stream_url: 'https://stream-gtlc.telecentro.net.ar/hls/canal26hls/main.m3u8',
      is_hd: true,
    },
  ];

  for (const ch of channels) {
    const existing = await prisma.channel.findFirst({ where: { name: ch.name } });
    if (!existing) {
      await prisma.channel.create({ data: ch });
    }
  }

  console.log('✅ Canales de Televisión Sembrados.');

  // 5. Sembrar Películas 4K VOD
  const movies = [
    {
      title: 'DUNA: PARTE DOS',
      category: 'ESTRENOS',
      year: 2024,
      duration: '2h 46m',
      rating: 'IMDb 8.7',
      synopsis: 'Paul Atreides se une a los Fremen y comienza un viaje espiritual y marcial para convertirse en Muad\'Dib.',
      poster_emoji: '🏜️',
      stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      title: 'AVATAR: EL CAMINO DEL AGUA',
      category: 'ESTRENOS',
      year: 2026,
      duration: '3h 12m',
      rating: 'IMDb 8.2',
      synopsis: 'Jake Sully vive con su nueva familia en el planeta Pandora. Cuando una amenaza regresa, deben proteger su hogar.',
      poster_emoji: '🌊',
      stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      title: 'JOHN WICK 4',
      category: 'ACCION',
      year: 2024,
      duration: '2h 49m',
      rating: 'IMDb 8.3',
      synopsis: 'John Wick descubre un camino para derrotar a la Alta Mesa.',
      poster_emoji: '🕶️',
      stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
  ];

  for (const m of movies) {
    const existing = await prisma.movie.findFirst({ where: { title: m.title } });
    if (!existing) {
      await prisma.movie.create({ data: m });
    }
  }

  console.log('🎉 Sincronización de base de datos Supabase completada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error al sembrar base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
