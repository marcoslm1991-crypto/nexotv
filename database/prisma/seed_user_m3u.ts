import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Importando Lista M3U completa del usuario a Supabase...');

  const channelsData = [
    // --- NOTICIAS ---
    { name: 'Canal 26 HD 720p', category: 'NOTICIAS', number: 26.1, logo_url: 'https://pbs.twimg.com/profile_images/1242114940/LogoCanal26.jpg', logo_emoji: '📰', now_playing: 'Noticias en Vivo 24hs HD', stream_url: 'http://200.115.193.177/live/26hd-720/.m3u8' },
    { name: 'Telemax HD', category: 'NOTICIAS', number: 26.3, logo_url: 'https://i.imgur.com/gfX0hdB.png', logo_emoji: '📺', now_playing: 'Telemax en Vivo', stream_url: 'http://live-edge01.telecentro.net.ar/live/smil:tlx.smil/master.m3u8' },
    { name: 'TreceMax TV', category: 'NOTICIAS', number: 13.2, logo_url: 'https://i.imgur.com/ZK7AQFg.png', logo_emoji: '📺', now_playing: 'Noticias Corrientes', stream_url: 'http://coninfo.net:1935/13max/live/chunklist.m3u8' },
    { name: 'CNN en Español', category: 'NOTICIAS', number: 3.1, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/CNN_International_logo.svg/200px-CNN_International_logo.svg.png', logo_emoji: '🌎', now_playing: 'Noticias Internacionales', stream_url: 'https://www.youtube.com/c/cnnespanol/live' },
    { name: 'TN Todo Noticias', category: 'NOTICIAS', number: 3.0, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/TN_todo_noticias_logo.svg/200px-TN_todo_noticias_logo.svg.png', logo_emoji: '📰', now_playing: 'TN en Vivo 24hs', stream_url: 'https://www.youtube.com/c/todonoticias/live' },
    { name: 'Telefe HD', category: 'ARGENTINA', number: 11.1, logo_url: 'http://www.baraderoteinforma.com.ar/wp-content/uploads/2017/01/cosas_640x480-23.jpg', logo_emoji: '🔵', now_playing: 'Siempre Juntos HD', stream_url: 'http://www.coninfo.net:1935/13max/live/playlist.m3u8' },
    { name: 'El Trece HD', category: 'ARGENTINA', number: 13.1, logo_url: 'https://pbs.twimg.com/profile_images/747466054834753536/LBbftqD9_400x400.jpg', logo_emoji: '📺', now_playing: 'El Trece en Vivo', stream_url: 'https://livetrx01.vodgc.net/eltrecetv/index.m3u8' },
    { name: 'A24 Noticias', category: 'NOTICIAS', number: 36.2, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/A24-logonuevo.svg/902px-A24-logonuevo.svg.png', logo_emoji: '📰', now_playing: 'A24 en Vivo', stream_url: 'https://www.youtube.com/c/A24com/live' },
    { name: 'AMERICA TV HD', category: 'ARGENTINA', number: 36.1, logo_url: 'https://i.imgur.com/Jt7dOQm.png', logo_emoji: '📺', now_playing: 'América TV en Directo', stream_url: 'https://prepublish.f.qaotic.net/a07/americahls-100056/playlist_720p.m3u8' },
    { name: 'C5N HD', category: 'NOTICIAS', number: 25.2, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/C5N_Logo_2015.PNG', logo_emoji: '📡', now_playing: 'El Diario en Vivo', stream_url: 'https://www.youtube.com/c/c5n/live' },
    { name: 'El Nueve', category: 'ARGENTINA', number: 35.1, logo_url: 'http://television.com.ar/wp-content/uploads/2016/12/elnuevenuevo.jpg', logo_emoji: '📺', now_playing: 'El Nueve en Vivo', stream_url: 'http://45.226.28.9:8085/Live/18e292ea93b66c65c76707f07c489d61/local-canal9.playlist.m3u8' },

    // --- PREMIUM ---
    { name: 'A&E Mundo HD', category: 'CINE', number: 201, logo_emoji: '🍿', now_playing: 'Series & Películas de Acción', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(AE_MUNDO_HD)/Stream(03)/index.m3u8' },
    { name: 'AXN HD', category: 'CINE', number: 202, logo_emoji: '🕶️', now_playing: 'Investigación & Suspenso', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(AXN_HD)/index.m3u8' },
    { name: 'Cinecanal HD', category: 'CINE', number: 203, logo_emoji: '🎬', now_playing: 'Estrenos de Hollywood', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(CINECANAL_HD)/index.m3u8' },
    { name: 'Cine Dinamita', category: 'CINE', number: 204, logo_emoji: '💥', now_playing: 'Cine de Acción Explosivo', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(CINEMA_DINAMITA)/index.m3u8' },
    { name: 'Cine Latino', category: 'CINE', number: 205, logo_emoji: '🎬', now_playing: 'Lo mejor del Cine Latinoamericano', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(CINELATINO)/index.m3u8' },
    { name: 'Eurochannel HD', category: 'CINE', number: 206, logo_emoji: '🇪🇺', now_playing: 'Cine Europeo', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(EUROCHANNEL)/index.m3u8' },
    { name: 'FOX HD', category: 'CINE', number: 207, logo_emoji: '🦊', now_playing: 'Cine & Series FOX', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(FOX_HD)/Stream(04)/index.m3u8' },
    { name: 'FX HD', category: 'CINE', number: 208, logo_emoji: '💥', now_playing: 'Películas de Ciencia Ficción', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(FX_HD)/index.m3u8' },
    { name: 'FOX Cinema HD', category: 'CINE', number: 209, logo_emoji: '🍿', now_playing: 'Cine Independiente & Estrenos', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(FOX_CINEMA_HD)/index.m3u8' },
    { name: 'Fox Action HD', category: 'CINE', number: 210, logo_emoji: '🥊', now_playing: 'Acción Extrema', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(FOXACTION_HD)/index.m3u8' },
    { name: 'FOX Movies HD', category: 'CINE', number: 211, logo_emoji: '🎥', now_playing: 'Películas Taquilleras', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(FOXMOVIES_HD)/index.m3u8' },
    { name: 'FOX Classics HD', category: 'CINE', number: 212, logo_emoji: '🎞️', now_playing: 'Clásicos del Cine', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(FOX_CLASSICS_HD)/index.m3u8' },
    { name: 'Film Zone HD', category: 'CINE', number: 213, logo_emoji: '🍿', now_playing: 'Cine Variado 24hs', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(THE_FILM_ZONE_HD)/Stream(03)/index.m3u8' },
    { name: 'Golden HD', category: 'CINE', number: 214, logo_emoji: '🌟', now_playing: 'Grandes Éxitos de Hollywood', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(GOLDEN)/index.m3u8' },
    { name: 'HBO HD', category: 'CINE', number: 215, logo_emoji: '👑', now_playing: 'Producciones Originales HBO', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(HBO_HD)/index.m3u8' },
    { name: 'HBO Family HD', category: 'INFANTIL', number: 216, logo_emoji: '👨‍👩‍👧', now_playing: 'Cine Familiar HBO', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(HBO_FAMILY_HD)/Stream(03)/index.m3u8' },
    { name: 'HBO Plus HD', category: 'CINE', number: 217, logo_emoji: '💥', now_playing: 'Acción & Terror 4K', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(HBO_PLUS_HD)/index.m3u8' },
    { name: 'HBO Signature HD', category: 'CINE', number: 218, logo_emoji: '📽️', now_playing: 'Series Premiadas', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(HBO_SIGNATURE_HD)/index.m3u8' },
    { name: 'MAX HD', category: 'CINE', number: 219, logo_emoji: '🎬', now_playing: 'Cine de Autor & Estrenos', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(MAX)/index.m3u8' },
    { name: 'MAX Prime HD', category: 'CINE', number: 220, logo_emoji: '⚡', now_playing: 'Acción & Veloz', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(MAX_PRIME_HD)/index.m3u8' },
    { name: 'MultiPremier', category: 'CINE', number: 221, logo_emoji: '🍿', now_playing: 'Estrenos MultiPremier', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(MULTIPREMIER)/index.m3u8' },
    { name: 'Paramount Channel HD', category: 'CINE', number: 222, logo_emoji: '⛰️', now_playing: 'Películas de Paramount', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(PARAMOUNT_HD)/index.m3u8' },
    { name: 'Space HD', category: 'CINE', number: 223, logo_emoji: '🚀', now_playing: 'Combate & Acción', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(SPACE_HD)/Stream(03)/index.m3u8' },
    { name: 'Sony HD', category: 'CINE', number: 224, logo_emoji: '📺', now_playing: 'Series & Reality Shows', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(SONY_HD)/Stream(03)/index.m3u8' },
    { name: 'Studio Universal', category: 'CINE', number: 225, logo_emoji: '🎬', now_playing: 'El Arte del Cine', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(STUDIO_UNIVERSAL)/index.m3u8' },
    { name: 'Sundance HD', category: 'CINE', number: 226, logo_emoji: '🎭', now_playing: 'Cine de Festival', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(SUNDANCE_HD)/index.m3u8' },
    { name: 'TCM HD', category: 'CINE', number: 227, logo_emoji: '🎞️', now_playing: 'Turnes Classic Movies', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(TCM)/index.m3u8' },
    { name: 'TNT HD', category: 'CINE', number: 228, logo_emoji: '💥', now_playing: 'Eventos & Películas', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(TNT_HD)/Stream(02)/index.m3u8' },
    { name: 'TNT Series HD', category: 'CINE', number: 229, logo_emoji: '📺', now_playing: 'Series Continuadas', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(TNT_SERIES_HD)/Stream(03)/index.m3u8' },
    { name: 'Universal Channel HD', category: 'CINE', number: 230, logo_emoji: '🌌', now_playing: 'Universal Studios HD', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(UNIVERSAL_CHANNEL_HD)/Stream(03)/index.m3u8' },
    { name: 'Warner HD', category: 'CINE', number: 231, logo_emoji: '📽️', now_playing: 'Series Warner en Vivo', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(WARNER_HD)/index.m3u8' },

    // --- DOCUMENTALES & INFANTILES ---
    { name: 'Animal Planet HD', category: 'DOCUMENTALES', number: 401, logo_emoji: '🦁', now_playing: 'Vida Salvaje & Naturaleza', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(ANIMAL_PLANET_HD)/index.m3u8' },
    { name: 'Comedy Central HD', category: 'DOCUMENTALES', number: 402, logo_emoji: '😂', now_playing: 'Stand Up & Humor 24hs', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(COMEDY_CENTRAL_HD)/Stream(06)/index.m3u8' },
    { name: 'E! Entertainment', category: 'DOCUMENTALES', number: 403, logo_emoji: '✨', now_playing: 'Fama & Modas', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(E)/index.m3u8' },
    { name: 'Discovery Civilization', category: 'DOCUMENTALES', number: 404, logo_emoji: '🏛️', now_playing: 'Grandes Civilizaciones', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(DISCOVERY_CIVILIZATION)/index.m3u8' },
    { name: 'Discovery Home & Health', category: 'DOCUMENTALES', number: 405, logo_emoji: '🏡', now_playing: 'Hogar & Salud', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(DISCOVERY_HOME_HEALTH_HD)/index.m3u8' },
    { name: 'Discovery ID', category: 'DOCUMENTALES', number: 406, logo_emoji: '🔍', now_playing: 'Investigación Criminal', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(ID_HD)/index.m3u8' },
    { name: 'Discovery TLC', category: 'DOCUMENTALES', number: 407, logo_emoji: '✈️', now_playing: 'Viajes & Estilos de Vida', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(TLC_HD)/index.m3u8' },
    { name: 'Discovery Turbo', category: 'DOCUMENTALES', number: 408, logo_emoji: '🏎️', now_playing: 'Autos & Velocidad', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(DISCOVERY_TURBO)/index.m3u8' },
    { name: 'Discovery Science', category: 'DOCUMENTALES', number: 409, logo_emoji: '🔬', now_playing: 'Ciencia & Futuro', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(DISCOVERY_SCIENCE)/index.m3u8' },
    { name: 'History Channel HD', category: 'DOCUMENTALES', number: 410, logo_emoji: '📜', now_playing: 'Grandes Documentales de la Historia', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(HISTORY_CHANNEL_HD)/index.m3u8' },
    { name: 'Nat Geo HD', category: 'DOCUMENTALES', number: 411, logo_emoji: '🌍', now_playing: 'National Geographic', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(NATGEO_HD)/Stream(05)/index.m3u8' },

    // --- INFANTILES ---
    { name: 'Boomerang HD', category: 'INFANTIL', number: 301, logo_emoji: '🎈', now_playing: 'Caricaturas Clásicas', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(BOOMERANG)/Stream(04)/index.m3u8' },
    { name: 'Disney XD', category: 'INFANTIL', number: 302, logo_emoji: '🚀', now_playing: 'Series Animadas & Acción', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(DISNEY_XD)/index.m3u8' },
    { name: 'Disney Jr', category: 'INFANTIL', number: 303, logo_emoji: '🏰', now_playing: 'Programación Preescolar', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(DISNEY_JR)/Stream(03)/index.m3u8' },
    { name: 'Tooncast', category: 'INFANTIL', number: 304, logo_emoji: '🎨', now_playing: 'Retro Cartoons 24hs', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(TOONCAST)/index.m3u8' },

    // --- MUSICA ---
    { name: 'MTV HD', category: 'MUSICA', number: 501, logo_emoji: '🎸', now_playing: 'Hits Mundiales & Shows', stream_url: 'http://tstv.lcdn.claro.net.co/Content/hls/Live/Channel(MTV_HD)/index.m3u8' },
    { name: 'Music Top HD', category: 'MUSICA', number: 502, logo_emoji: '🎧', now_playing: 'Top 40 en Vivo', stream_url: 'http://live-edge01.telecentro.net.ar/live/msctphd-720/playlist.m3u8' },
    { name: 'Power HD', category: 'MUSICA', number: 503, logo_emoji: '🔊', now_playing: 'Música Latina & Reggaeton', stream_url: 'http://wowza.telpin.com.ar:1935/live-powerTV/power.stream/playlist.m3u8' },
  ];

  let channelsCount = 0;
  for (const ch of channelsData) {
    const existing = await prisma.channel.findFirst({ where: { name: ch.name } });
    if (!existing) {
      await prisma.channel.create({ data: { ...ch, is_hd: true, is_active: true } });
      channelsCount++;
    } else {
      await prisma.channel.update({
        where: { id: existing.id },
        data: { stream_url: ch.stream_url, logo_url: ch.logo_url || existing.logo_url },
      });
    }
  }

  console.log(`✅ ${channelsCount} Canales M3U cargados a Supabase.`);

  // --- PELICULAS VOD DE LA LISTA DEL USUARIO ---
  const moviesData = [
    {
      title: 'Verónica (2017)',
      category: 'TERROR',
      year: 2017,
      duration: '1h 45m',
      rating: 'IMDb 6.2',
      synopsis: 'En Madrid en los años 90, una joven debe proteger a sus hermanos menores tras realizar una sesión de Ouija con sus amigas durante un eclipse solar.',
      poster_emoji: '👻',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2018/03/MV5BMmRkMDQzYzItZDFhMS00YzM1LTk0ZGMtZmExMzdiNzEwOTE4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/secret-tempest-196513.appspot.com/Veronica.2017.Castellano.mp4',
    },
    {
      title: 'La Noche del Demonio: La Última Llave',
      category: 'TERROR',
      year: 2018,
      duration: '1h 43m',
      rating: 'IMDb 5.7',
      synopsis: 'La parapsicóloga Elise Rainier enfrenta su caso más aterrador al ser llamada a investigar los sucesos paranormales en su propia casa de la infancia.',
      poster_emoji: '🔑',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2018/03/MV5BMTUxODU0NjQ2Nl5BMl5BanBnXkFtZTgwMTc4NDQ0MzI@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/secret-tempest-196513.appspot.com/Insidious.The.Last.Key.2018.mp4',
    },
    {
      title: 'Coco (2017)',
      category: 'INFANTIL',
      year: 2017,
      duration: '1h 45m',
      rating: 'IMDb 8.4',
      synopsis: 'El joven Miguel sueña con convertirse en músico y accidentalmente se encuentra atrapado en la deslumbrante y colorida Tierra de los Muertos.',
      poster_emoji: '🎸',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2018/01/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODIxMzk5NjA@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/secret-tempest-196513.appspot.com/Coco.2017.OK.mp4',
    },
    {
      title: 'Guardianes de la Galaxia 2',
      category: 'ACCION',
      year: 2017,
      duration: '2h 16m',
      rating: 'IMDb 7.6',
      synopsis: 'Los Guardianes deben luchar para mantener unida a su nueva familia mientras descubren los misterios del verdadero linaje de Peter Quill.',
      poster_emoji: '🌌',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2017/08/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/secret-tempest-196513.appspot.com/Guardians.of.the.Galaxy.2.2017.mp4',
    },
    {
      title: 'Thor 3: Ragnarok',
      category: 'ACCION',
      year: 2017,
      duration: '2h 10m',
      rating: 'IMDb 7.9',
      synopsis: 'Thor está encarcelado al otro lado del universo y debe competir en un combate de gladiadores contra su antiguo aliado, el Increíble Hulk.',
      poster_emoji: '⚡',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2018/01/MV5BMjMyNDkzMzI1OF5BMl5BanBnXkFtZTgwODcxODg5MjI@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/secret-tempest-196513.appspot.com/Thor.Ragnarok.2017.mp4',
    },
    {
      title: 'El Gran Showman',
      category: 'DRAMA',
      year: 2017,
      duration: '1h 45m',
      rating: 'IMDb 7.5',
      synopsis: 'Celebración del nacimiento del espectáculo y la historia de un visionario que surgió de la nada para crear un espectáculo fascinante.',
      poster_emoji: '🎪',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2018/03/MV5BYjQ0ZWJkYjMtYjJmYS00MjJiLTg3NTYtMmIzN2E2Y2YwZmUyXkEyXkFqcGdeQXVyNjk5NDA3OTk@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/secret-tempest-196513.appspot.com/The.Greatest.Showman.2017.mp4',
    },
    {
      title: 'Jumanji: Bienvenidos a la Jungla',
      category: 'ACCION',
      year: 2017,
      duration: '1h 59m',
      rating: 'IMDb 6.9',
      synopsis: 'Cuatro adolescentes son absorbidos por un videojuego mágico y la única forma de escapar es trabajar juntos para terminar el juego.',
      poster_emoji: '🎮',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2018/03/MV5BMTkyNDQ1MDc5OV5BMl5BanBnXkFtZTgwOTcyNzI2MzI@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/secret-tempest-196513.appspot.com/Jumanji.2017.mp4',
    },
    {
      title: 'Star Wars: Los Últimos Jedi',
      category: 'SCIFI',
      year: 2017,
      duration: '2h 32m',
      rating: 'IMDb 7.0',
      synopsis: 'Rey desarrolla sus nuevas habilidades con la guía de Luke Skywalker mientras la Resistencia se prepara para la batalla contra la Primera Orden.',
      poster_emoji: '⚔️',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2018/03/MV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/secret-tempest-196513.appspot.com/Star.Wars.The.Last.Jedi.2017.mp4',
    },
    {
      title: 'La Forma del Agua',
      category: 'SCIFI',
      year: 2017,
      duration: '2h 03m',
      rating: 'IMDb 7.3',
      synopsis: 'En un centro de investigación de alta seguridad, una mujer muda entabla una relación secreta con un anfibio humanoide prisionero.',
      poster_emoji: '🧜‍♂️',
      poster_url: 'https://www.cuevana2.tv/wp-content/uploads/2018/01/MV5BNGNiNWQ5M2MtNGI0OC00MDA2LWI5NzEtMmZiYjVjMDEyOWYzXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_SX300.jpg',
      stream_url: 'https://storage.googleapis.com/new-project-189619.appspot.com/shapagua.mp4',
    },
  ];

  let moviesCount = 0;
  for (const m of moviesData) {
    const existing = await prisma.movie.findFirst({ where: { title: m.title } });
    if (!existing) {
      await prisma.movie.create({ data: { ...m, is_active: true } });
      moviesCount++;
    } else {
      await prisma.movie.update({
        where: { id: existing.id },
        data: { stream_url: m.stream_url, poster_url: m.poster_url },
      });
    }
  }

  console.log(`✅ ${moviesCount} Películas VOD reales cargadas a Supabase.`);
  console.log('🎉 Sincronización masiva de M3U del usuario completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error importando M3U del usuario:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
