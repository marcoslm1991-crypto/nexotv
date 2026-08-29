import React, { useState, useEffect, useRef } from 'react';

// --- Interfaces ---
interface UserRecord {
  id: string;
  alias: string;
  name: string;
  plan_name: string;
  plan_code: string;
  subscription_status: 'VIGENTE' | 'PROXIMO_A_VENCER' | 'VENCIDO' | 'SUSPENDIDO';
  end_date: string;
  max_screens: number;
  profile_count: number;
}

export type StreamFormat = 'HLS' | 'DASH' | 'MP4' | 'WEBM' | 'CUSTOM';
export type StreamStatus = 'WORKING' | 'ERROR' | 'UNAVAILABLE' | 'UNCHECKED';

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  type: 'ALL' | 'TV' | 'MOVIE' | 'SERIES';
  image_url?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ChannelSourceRecord {
  id: string;
  channel_id: string;
  url: string;
  format: StreamFormat;
  is_active: boolean;
  priority: number;
  last_checked_at?: string | null;
  last_status: StreamStatus;
  last_http_code?: number | null;
  last_response_time?: number | null;
  last_error_message?: string | null;
  created_at: string;
}

export interface ChannelRecord {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  logo_url?: string | null;
  logo_emoji?: string;
  description?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  sources: ChannelSourceRecord[];
}

export interface MovieSourceRecord {
  id: string;
  movie_id: string;
  url: string;
  format: StreamFormat;
  is_active: boolean;
  priority: number;
  last_checked_at?: string | null;
  last_status: StreamStatus;
  last_http_code?: number | null;
  last_response_time?: number | null;
  last_error_message?: string | null;
  created_at: string;
}

export interface MovieRecord {
  id: string;
  title: string;
  original_title?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  genre?: string | null;
  year: number;
  duration?: string | null;
  rating?: string | null;
  synopsis?: string | null;
  poster_url?: string | null;
  backdrop_url?: string | null;
  poster_emoji?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  sources: MovieSourceRecord[];
}

export interface EpisodeSourceRecord {
  id: string;
  episode_id: string;
  url: string;
  format: StreamFormat;
  is_active: boolean;
  priority: number;
  last_checked_at?: string | null;
  last_status: StreamStatus;
  last_http_code?: number | null;
  last_response_time?: number | null;
  last_error_message?: string | null;
  created_at: string;
}

export interface EpisodeRecord {
  id: string;
  season_id: string;
  episode_number: number;
  title: string;
  duration?: string | null;
  synopsis?: string | null;
  thumbnail_url?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  sources: EpisodeSourceRecord[];
}

export interface SeasonRecord {
  id: string;
  series_id: string;
  season_number: number;
  title?: string | null;
  is_active: boolean;
  sort_order: number;
  episodes: EpisodeRecord[];
}

export interface SeriesRecord {
  id: string;
  title: string;
  original_title?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  genre?: string | null;
  year: number;
  rating?: string | null;
  synopsis?: string | null;
  poster_url?: string | null;
  backdrop_url?: string | null;
  poster_emoji?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  seasons: SeasonRecord[];
}

export function App() {
  // Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Main Section Navigation
  const [mainSection, setMainSection] = useState<'CONTENT' | 'CLIENTS'>('CONTENT');

  // Content Sub-Modules Hub
  const [contentHubModule, setContentHubModule] = useState<'LIVE_TV' | 'MOVIES' | 'SERIES' | 'CATEGORIES'>('LIVE_TV');

  // 1. CLIENTS DATA
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 'u1', alias: 'MARCOS01', name: 'Marcos Pérez', plan_name: 'Plan Familiar', plan_code: 'FAMILIAR', subscription_status: 'VIGENTE', end_date: '2026-09-25', max_screens: 3, profile_count: 3 },
    { id: 'u2', alias: 'JUAN_TV', name: 'Juan Gómez', plan_name: 'Plan Individual', plan_code: 'INDIVIDUAL', subscription_status: 'PROXIMO_A_VENCER', end_date: '2026-08-30', max_screens: 1, profile_count: 1 },
    { id: 'u3', alias: 'LUCA_FAM', name: 'Lucas Rodríguez', plan_name: 'Plan Familiar Plus', plan_code: 'FAMILIAR_PLUS', subscription_status: 'VENCIDO', end_date: '2026-08-10', max_screens: 5, profile_count: 4 },
  ]);

  // 2. CATEGORIES DATA
  const [categories, setCategories] = useState<CategoryRecord[]>([
    { id: 'cat-1', name: 'Argentina', slug: 'argentina', type: 'TV', image_url: 'https://flagcdn.com/w80/ar.png', is_active: true, sort_order: 1, created_at: '2026-08-01' },
    { id: 'cat-2', name: 'Deportes', slug: 'deportes', type: 'ALL', image_url: '⚽', is_active: true, sort_order: 2, created_at: '2026-08-01' },
    { id: 'cat-3', name: 'Noticias', slug: 'noticias', type: 'TV', image_url: '📰', is_active: true, sort_order: 3, created_at: '2026-08-01' },
    { id: 'cat-4', name: 'Cine & Estrenos', slug: 'cine', type: 'MOVIE', image_url: '🎬', is_active: true, sort_order: 4, created_at: '2026-08-01' },
    { id: 'cat-5', name: 'Acción', slug: 'accion', type: 'ALL', image_url: '🔥', is_active: true, sort_order: 5, created_at: '2026-08-01' },
    { id: 'cat-6', name: 'Ciencia Ficción', slug: 'scifi', type: 'ALL', image_url: '🚀', is_active: true, sort_order: 6, created_at: '2026-08-01' },
    { id: 'cat-7', name: 'Drama & Series', slug: 'drama', type: 'SERIES', image_url: '📺', is_active: true, sort_order: 7, created_at: '2026-08-01' },
    { id: 'cat-8', name: 'Infantil', slug: 'infantil', type: 'ALL', image_url: '🧸', is_active: true, sort_order: 8, created_at: '2026-08-01' },
  ]);

  // 3. TV CHANNELS DATA & SUB-TABS
  const [tvSubTab, setTvSubTab] = useState<'CHANNELS' | 'SOURCES' | 'FILTERS'>('CHANNELS');
  const [channels, setChannels] = useState<ChannelRecord[]>([
    {
      id: 'ch-telefe',
      name: 'Telefe HD',
      category_id: 'cat-1',
      category_name: 'Argentina',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Telefe_logo_2018.svg/320px-Telefe_logo_2018.svg.png',
      logo_emoji: '📺',
      description: 'Televisión abierta de Argentina en vivo 24/7.',
      is_active: true,
      sort_order: 1,
      created_at: '2026-08-15',
      updated_at: '2026-08-28',
      sources: [
        { id: 'src-telefe-1', channel_id: 'ch-telefe', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', format: 'HLS', is_active: true, priority: 1, last_status: 'WORKING', last_http_code: 200, last_response_time: 145, last_checked_at: '2026-08-28 14:00', created_at: '2026-08-15' },
        { id: 'src-telefe-2', channel_id: 'ch-telefe', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', format: 'MP4', is_active: false, priority: 2, last_status: 'WORKING', last_http_code: 200, last_response_time: 210, last_checked_at: '2026-08-27 10:30', created_at: '2026-08-16' },
      ],
    },
    {
      id: 'ch-tyc',
      name: 'TyC Sports HD',
      category_id: 'cat-2',
      category_name: 'Deportes',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/TyC_Sports_Logo.svg/320px-TyC_Sports_Logo.svg.png',
      logo_emoji: '⚽',
      description: 'El canal de deportes N°1 de la Argentina.',
      is_active: true,
      sort_order: 2,
      created_at: '2026-08-15',
      updated_at: '2026-08-28',
      sources: [
        { id: 'src-tyc-1', channel_id: 'ch-tyc', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', format: 'HLS', is_active: true, priority: 1, last_status: 'WORKING', last_http_code: 200, last_response_time: 98, last_checked_at: '2026-08-28 13:45', created_at: '2026-08-15' },
      ],
    },
    {
      id: 'ch-tn',
      name: 'TN Todo Noticias',
      category_id: 'cat-3',
      category_name: 'Noticias',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Todo_Noticias_2016.svg/320px-Todo_Noticias_2016.svg.png',
      logo_emoji: '📰',
      description: 'Noticias e información en vivo las 24 horas.',
      is_active: true,
      sort_order: 3,
      created_at: '2026-08-15',
      updated_at: '2026-08-28',
      sources: [
        { id: 'src-tn-1', channel_id: 'ch-tn', url: 'https://stream-invalid-sample.com/live.m3u8', format: 'HLS', is_active: true, priority: 1, last_status: 'ERROR', last_http_code: 503, last_response_time: 5000, last_error_message: 'Servidor no responde (503 Service Unavailable)', last_checked_at: '2026-08-28 12:15', created_at: '2026-08-18' },
      ],
    },
    {
      id: 'ch-cine',
      name: 'Cine Premium 4K',
      category_id: 'cat-4',
      category_name: 'Cine',
      logo_url: null,
      logo_emoji: '🍿',
      description: 'Películas taquilleras sin cortes comerciales.',
      is_active: false,
      sort_order: 4,
      created_at: '2026-08-20',
      updated_at: '2026-08-28',
      sources: [],
    },
  ]);
  const [selectedChannelForSources, setSelectedChannelForSources] = useState<ChannelRecord | null>(null);

  // 4. MOVIES DATA & SUB-TABS
  const [movieSubTab, setMovieSubTab] = useState<'MOVIES' | 'SOURCES' | 'FILTERS'>('MOVIES');
  const [movies, setMovies] = useState<MovieRecord[]>([
    {
      id: 'm-1',
      title: 'John Wick: Otro Día para Matar',
      original_title: 'John Wick',
      category_id: 'cat-5',
      category_name: 'Acción',
      genre: 'Acción',
      year: 2014,
      duration: '1h 41m',
      rating: 'IMDb 7.4',
      synopsis: 'Un exasesino a sueldo sale de su retiro para buscar a los gánsteres que le quitaron todo.',
      poster_url: 'https://images.justwatch.com/poster/176378411/s718/john-wick.f4v',
      poster_emoji: '🎬',
      is_active: true,
      sort_order: 1,
      created_at: '2026-08-10',
      updated_at: '2026-08-28',
      sources: [
        { id: 'src-m1-1', movie_id: 'm-1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', format: 'MP4', is_active: true, priority: 1, last_status: 'WORKING', last_http_code: 200, last_response_time: 125, last_checked_at: '2026-08-28 15:00', created_at: '2026-08-10' },
        { id: 'src-m1-2', movie_id: 'm-1', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', format: 'HLS', is_active: false, priority: 2, last_status: 'WORKING', last_http_code: 200, last_response_time: 210, last_checked_at: '2026-08-27 12:00', created_at: '2026-08-12' },
      ],
    },
    {
      id: 'm-2',
      title: 'Duna: Parte Dos',
      original_title: 'Dune: Part Two',
      category_id: 'cat-6',
      category_name: 'Ciencia Ficción',
      genre: 'Ciencia Ficción',
      year: 2024,
      duration: '2h 46m',
      rating: 'IMDb 8.6',
      synopsis: 'Paul Atreides se une a Chani y los Fremen mientras busca venganza contra los conspiradores.',
      poster_url: 'https://images.justwatch.com/poster/312015383/s718/dune-part-two.f4v',
      poster_emoji: '🏜️',
      is_active: true,
      sort_order: 2,
      created_at: '2026-08-18',
      updated_at: '2026-08-28',
      sources: [
        { id: 'src-m2-1', movie_id: 'm-2', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', format: 'HLS', is_active: true, priority: 1, last_status: 'WORKING', last_http_code: 200, last_response_time: 98, last_checked_at: '2026-08-28 14:20', created_at: '2026-08-18' },
      ],
    },
  ]);
  const [selectedMovieForSources, setSelectedMovieForSources] = useState<MovieRecord | null>(null);

  // 5. SERIES DATA & SUB-TABS
  const [seriesSubTab, setSeriesSubTab] = useState<'SERIES' | 'SEASONS' | 'EPISODE_SOURCES' | 'FILTERS'>('SERIES');
  const [seriesList, setSeriesList] = useState<SeriesRecord[]>([
    {
      id: 'ser-1',
      title: 'The Walking Dead',
      original_title: 'The Walking Dead',
      category_id: 'cat-7',
      category_name: 'Drama & Series',
      genre: 'Drama / Terror',
      year: 2010,
      rating: 'IMDb 8.1',
      synopsis: 'Rick Grimes lidera a sobrevivientes en un apocalipsis zombie.',
      poster_url: 'https://images.justwatch.com/poster/8636181/s718/the-walking-dead.f4v',
      poster_emoji: '🧟',
      is_active: true,
      sort_order: 1,
      created_at: '2026-08-10',
      updated_at: '2026-08-28',
      seasons: [
        {
          id: 'sea-1',
          series_id: 'ser-1',
          season_number: 1,
          title: 'Temporada 1',
          is_active: true,
          sort_order: 1,
          episodes: [
            {
              id: 'ep-1-1',
              season_id: 'sea-1',
              episode_number: 1,
              title: 'Días Transcurridos',
              duration: '1h 07m',
              synopsis: 'Rick despierta en un hospital desertificado.',
              is_active: true,
              sort_order: 1,
              created_at: '2026-08-10',
              sources: [
                { id: 'src-ep1-1', episode_id: 'ep-1-1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', format: 'MP4', is_active: true, priority: 1, last_status: 'WORKING', last_http_code: 200, last_response_time: 150, last_checked_at: '2026-08-28 14:00', created_at: '2026-08-10' },
              ],
            },
            { id: 'ep-1-2', season_id: 'sea-1', episode_number: 2, title: 'Tripas', duration: '45m', synopsis: 'Rick es atrapado por una horda en Atlanta.', is_active: true, sort_order: 2, created_at: '2026-08-10', sources: [] },
          ],
        },
      ],
    },
  ]);
  const [selectedSeries, setSelectedSeries] = useState<SeriesRecord | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<SeasonRecord | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeRecord | null>(null);

  // Form Modales State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryRecord | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catType, setCatType] = useState<'ALL' | 'TV' | 'MOVIE' | 'SERIES'>('ALL');

  const [showChannelModal, setShowChannelModal] = useState(false);
  const [editChannel, setEditChannel] = useState<ChannelRecord | null>(null);
  const [chName, setChName] = useState('');
  const [chCategoryId, setChCategoryId] = useState('');
  const [chInitialUrl, setChInitialUrl] = useState('');
  const [chInitialFormat, setChInitialFormat] = useState<StreamFormat>('HLS');

  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editMovie, setEditMovie] = useState<MovieRecord | null>(null);
  const [mTitle, setMTitle] = useState('');
  const [mOriginalTitle, setMOriginalTitle] = useState('');
  const [mCategoryId, setMCategoryId] = useState('');
  const [mGenre, setMGenre] = useState('Acción');
  const [mYear, setMYear] = useState(2026);
  const [mDuration, setMDuration] = useState('2h 00m');
  const [mRating, setMRating] = useState('IMDb 8.0');
  const [mSynopsis, setMSynopsis] = useState('');
  const [mPosterUrl, setMPosterUrl] = useState('');
  const [mInitialUrl, setMInitialUrl] = useState('');
  const [mInitialFormat, setMInitialFormat] = useState<StreamFormat>('MP4');

  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [editSeriesItem, setEditSeriesItem] = useState<SeriesRecord | null>(null);
  const [sTitle, setSTitle] = useState('');
  const [sOriginalTitle, setSOriginalTitle] = useState('');
  const [sCategoryId, setSCategoryId] = useState('');
  const [sGenre, setSGenre] = useState('Drama');
  const [sYear, setSYear] = useState(2026);

  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [seasonNum, setSeasonNum] = useState(1);
  const [seasonTitleText, setSeasonTitleText] = useState('Temporada 1');

  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [editEpisode, setEditEpisode] = useState<EpisodeRecord | null>(null);
  const [epNum, setEpNum] = useState(1);
  const [epTitle, setEpTitle] = useState('');
  const [epDuration, setEpDuration] = useState('45m');
  const [epSynopsis, setEpSynopsis] = useState('');
  const [epInitialUrl, setEpInitialUrl] = useState('');
  const [epInitialFormat, setEpInitialFormat] = useState<StreamFormat>('HLS');

  const [showAddTvSourceModal, setShowAddTvSourceModal] = useState(false);
  const [showAddMovieSourceModal, setShowAddMovieSourceModal] = useState(false);
  const [showAddEpSourceModal, setShowAddEpSourceModal] = useState(false);

  const [srcUrl, setSrcUrl] = useState('');
  const [srcFormat, setSrcFormat] = useState<StreamFormat>('HLS');
  const [srcPriority, setSrcPriority] = useState(1);

  // Quick Switch (⚡) Modal
  const [showQuickSwitchModal, setShowQuickSwitchModal] = useState(false);
  const [qsContentType, setQsContentType] = useState<'TV' | 'MOVIE' | 'EPISODE'>('TV');
  const [qsTargetId, setQsTargetId] = useState('');
  const [qsNewUrl, setQsNewUrl] = useState('');
  const [qsFormat, setQsFormat] = useState<StreamFormat>('HLS');

  // Testing & Video Preview States
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);
  const [previewStream, setPreviewStream] = useState<{ url: string; format: StreamFormat; title: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Synchronize selections
  useEffect(() => {
    if (channels.length > 0 && !selectedChannelForSources) setSelectedChannelForSources(channels[0]);
    if (movies.length > 0 && !selectedMovieForSources) setSelectedMovieForSources(movies[0]);
    if (seriesList.length > 0 && !selectedSeries) {
      setSelectedSeries(seriesList[0]);
      if (seriesList[0].seasons.length > 0) {
        setSelectedSeason(seriesList[0].seasons[0]);
        if (seriesList[0].seasons[0].episodes.length > 0) {
          setSelectedEpisode(seriesList[0].seasons[0].episodes[0]);
        }
      }
    }
  }, [channels, movies, seriesList]);

  // HLS Preview player logic
  useEffect(() => {
    if (previewStream && previewStream.format === 'HLS' && videoRef.current) {
      const video = videoRef.current;
      const hlsWindow = window as any;
      if (hlsWindow.Hls && hlsWindow.Hls.isSupported()) {
        const hls = new hlsWindow.Hls();
        hls.loadSource(previewStream.url);
        hls.attachMedia(video);
        hls.on(hlsWindow.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = previewStream.url;
        video.play().catch(() => {});
      }
    }
  }, [previewStream]);

  // Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!adminUser.trim() || !adminPassword.trim()) {
      setLoginError('Por favor ingresa usuario y contraseña de administrador.');
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      if (adminUser.toLowerCase() === 'admin' && adminPassword === 'admin123') {
        setIsAdminLoggedIn(true);
        setLoginError('');
      } else {
        setLoginError('Credenciales administrativas incorrectas. Acceso denegado.');
      }
    }, 400);
  };

  // Technical Link Testing (▶ Probar enlace / Anti-SSRF)
  const runTechnicalLinkTest = (sourceId: string, urlStr: string, format: StreamFormat, updateSourceCallback: (status: StreamStatus, httpCode: number, responseMs: number, msg?: string) => void) => {
    setTestingId(sourceId);
    setTestFeedback(`Probando conexión técnica con ${urlStr}...`);

    const urlLower = urlStr.toLowerCase();
    const isPrivate = urlLower.includes('localhost') || urlLower.includes('127.0.0.1') || urlLower.includes('192.168.') || urlLower.includes('10.');

    setTimeout(() => {
      setTestingId(null);
      if (isPrivate) {
        setTestFeedback(`❌ Error Anti-SSRF: La URL apunta a una IP o red privada local no autorizada.`);
        updateSourceCallback('UNAVAILABLE', 400, 50, 'Protección Anti-SSRF activa');
        return;
      }

      const isBroken = urlLower.includes('invalid') || urlLower.includes('broken');
      const responseTime = isBroken ? 5000 : Math.floor(Math.random() * 140) + 70;
      const httpCode = isBroken ? 503 : 200;
      const status: StreamStatus = isBroken ? 'ERROR' : 'WORKING';

      updateSourceCallback(status, httpCode, responseTime, isBroken ? 'Servidor no responde (503)' : undefined);
      setTestFeedback(isBroken ? `❌ Error de servidor: HTTP ${httpCode}` : `✅ Conexión técnica exitosa: HTTP 200 OK (${responseTime}ms)`);
    }, 700);
  };

  // CHANNEL CRUD
  const openChannelModal = (ch?: ChannelRecord) => {
    if (ch) {
      setEditChannel(ch);
      setChName(ch.name);
      setChCategoryId(ch.category_id);
      setChInitialUrl('');
    } else {
      setEditChannel(null);
      setChName('');
      setChCategoryId(categories.find((c) => c.type === 'TV' || c.type === 'ALL')?.id || '');
      setChInitialUrl('');
      setChInitialFormat('HLS');
    }
    setShowChannelModal(true);
  };

  const handleSaveChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chName.trim()) return;
    const catObj = categories.find((c) => c.id === chCategoryId);
    const catName = catObj ? catObj.name : 'Sin Categoría';

    if (editChannel) {
      setChannels(channels.map((ch) => ch.id === editChannel.id ? { ...ch, name: chName, category_id: chCategoryId, category_name: catName, updated_at: new Date().toISOString().split('T')[0] } : ch));
    } else {
      const newChId = `ch-${Date.now()}`;
      const initialSources: ChannelSourceRecord[] = [];
      if (chInitialUrl.trim()) {
        initialSources.push({
          id: `src-${Date.now()}`,
          channel_id: newChId,
          url: chInitialUrl.trim(),
          format: chInitialFormat,
          is_active: true,
          priority: 1,
          last_status: 'WORKING',
          last_http_code: 200,
          last_response_time: 110,
          last_checked_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
          created_at: new Date().toISOString().split('T')[0],
        });
      }
      const newCh: ChannelRecord = {
        id: newChId,
        name: chName,
        category_id: chCategoryId,
        category_name: catName,
        logo_emoji: '📺',
        is_active: true,
        sort_order: channels.length + 1,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        sources: initialSources,
      };
      setChannels([...channels, newCh]);
    }
    setShowChannelModal(false);
  };

  // MOVIES CRUD & SOURCES
  const openMovieModal = (m?: MovieRecord) => {
    if (m) {
      setEditMovie(m);
      setMTitle(m.title);
      setMOriginalTitle(m.original_title || '');
      setMCategoryId(m.category_id || '');
      setMGenre(m.genre || 'Acción');
      setMYear(m.year);
      setMDuration(m.duration || '2h 00m');
      setMRating(m.rating || 'IMDb 8.0');
      setMSynopsis(m.synopsis || '');
      setMPosterUrl(m.poster_url || '');
      setMInitialUrl('');
    } else {
      setEditMovie(null);
      setMTitle('');
      setMOriginalTitle('');
      setMCategoryId(categories.find((c) => c.type === 'MOVIE' || c.type === 'ALL')?.id || '');
      setMGenre('Acción');
      setMYear(2026);
      setMDuration('2h 00m');
      setMRating('IMDb 8.0');
      setMSynopsis('');
      setMPosterUrl('');
      setMInitialUrl('');
      setMInitialFormat('MP4');
    }
    setShowMovieModal(true);
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) return;

    const catObj = categories.find((c) => c.id === mCategoryId);
    const catName = catObj ? catObj.name : 'Sin Categoría';

    if (editMovie) {
      setMovies(movies.map((m) => m.id === editMovie.id ? { ...m, title: mTitle, original_title: mOriginalTitle || null, category_id: mCategoryId, category_name: catName, genre: mGenre, year: mYear, duration: mDuration, rating: mRating, synopsis: mSynopsis || null, poster_url: mPosterUrl || null, updated_at: new Date().toISOString().split('T')[0] } : m));
    } else {
      const newMId = `m-${Date.now()}`;
      const initialSources: MovieSourceRecord[] = [];
      if (mInitialUrl.trim()) {
        initialSources.push({
          id: `src-m-${Date.now()}`,
          movie_id: newMId,
          url: mInitialUrl.trim(),
          format: mInitialFormat,
          is_active: true,
          priority: 1,
          last_status: 'WORKING',
          last_http_code: 200,
          last_response_time: 125,
          last_checked_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
          created_at: new Date().toISOString().split('T')[0],
        });
      }

      const newM: MovieRecord = {
        id: newMId,
        title: mTitle,
        original_title: mOriginalTitle || null,
        category_id: mCategoryId,
        category_name: catName,
        genre: mGenre,
        year: mYear,
        duration: mDuration,
        rating: mRating,
        synopsis: mSynopsis || null,
        poster_url: mPosterUrl || null,
        poster_emoji: '🎬',
        is_active: true,
        sort_order: movies.length + 1,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        sources: initialSources,
      };
      setMovies([...movies, newM]);
    }
    setShowMovieModal(false);
  };

  const handleAddMovieSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovieForSources || !srcUrl.trim()) return;

    let updatedSources = [...selectedMovieForSources.sources];
    if (srcPriority === 1) {
      updatedSources = updatedSources.map((s) => ({ ...s, priority: s.priority + 1 }));
    }

    const newSrc: MovieSourceRecord = {
      id: `src-m-${Date.now()}`,
      movie_id: selectedMovieForSources.id,
      url: srcUrl.trim(),
      format: srcFormat,
      is_active: true,
      priority: srcPriority,
      last_status: 'UNCHECKED',
      created_at: new Date().toISOString().split('T')[0],
    };

    const finalSources = [newSrc, ...updatedSources];
    setSelectedMovieForSources({ ...selectedMovieForSources, sources: finalSources });
    setMovies(movies.map((m) => m.id === selectedMovieForSources.id ? { ...m, sources: finalSources } : m));
    setShowAddMovieSourceModal(false);
    setSrcUrl('');
  };

  // SERIES CRUD & EPISODE SOURCES
  const openSeriesModal = (s?: SeriesRecord) => {
    if (s) {
      setEditSeriesItem(s);
      setSTitle(s.title);
      setSOriginalTitle(s.original_title || '');
      setSCategoryId(s.category_id || '');
      setSGenre(s.genre || 'Drama');
      setSYear(s.year);
    } else {
      setEditSeriesItem(null);
      setSTitle('');
      setSOriginalTitle('');
      setSCategoryId(categories.find((c) => c.type === 'SERIES' || c.type === 'ALL')?.id || '');
      setSGenre('Drama');
      setSYear(2026);
    }
    setShowSeriesModal(true);
  };

  const handleSaveSeries = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle.trim()) return;
    const catObj = categories.find((c) => c.id === sCategoryId);
    const catName = catObj ? catObj.name : 'Sin Categoría';

    if (editSeriesItem) {
      setSeriesList(seriesList.map((s) => s.id === editSeriesItem.id ? { ...s, title: sTitle, original_title: sOriginalTitle || null, category_id: sCategoryId, category_name: catName, genre: sGenre, year: sYear, updated_at: new Date().toISOString().split('T')[0] } : s));
    } else {
      const newSId = `ser-${Date.now()}`;
      const defaultSeason: SeasonRecord = {
        id: `sea-${Date.now()}`,
        series_id: newSId,
        season_number: 1,
        title: 'Temporada 1',
        is_active: true,
        sort_order: 1,
        episodes: [],
      };
      const newS: SeriesRecord = {
        id: newSId,
        title: sTitle,
        original_title: sOriginalTitle || null,
        category_id: sCategoryId,
        category_name: catName,
        genre: sGenre,
        year: sYear,
        rating: 'IMDb 8.0',
        synopsis: null,
        poster_url: null,
        poster_emoji: '📺',
        is_active: true,
        sort_order: seriesList.length + 1,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        seasons: [defaultSeason],
      };
      setSeriesList([...seriesList, newS]);
    }
    setShowSeriesModal(false);
  };

  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeries || !selectedSeason || !epTitle.trim()) return;

    const newEpId = `ep-${Date.now()}`;
    const initialSources: EpisodeSourceRecord[] = [];
    if (epInitialUrl.trim()) {
      initialSources.push({
        id: `src-ep-${Date.now()}`,
        episode_id: newEpId,
        url: epInitialUrl.trim(),
        format: epInitialFormat,
        is_active: true,
        priority: 1,
        last_status: 'WORKING',
        last_http_code: 200,
        last_response_time: 140,
        last_checked_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
        created_at: new Date().toISOString().split('T')[0],
      });
    }

    const newEp: EpisodeRecord = {
      id: newEpId,
      season_id: selectedSeason.id,
      episode_number: epNum,
      title: epTitle,
      duration: epDuration,
      synopsis: epSynopsis || null,
      is_active: true,
      sort_order: epNum,
      created_at: new Date().toISOString().split('T')[0],
      sources: initialSources,
    };

    const updatedEpisodes = [...selectedSeason.episodes, newEp];
    const updatedSeasons = selectedSeries.seasons.map((se) => se.id === selectedSeason.id ? { ...se, episodes: updatedEpisodes } : se);
    setSeriesList(seriesList.map((s) => s.id === selectedSeries.id ? { ...s, seasons: updatedSeasons } : s));
    setSelectedSeries({ ...selectedSeries, seasons: updatedSeasons });
    setSelectedSeason({ ...selectedSeason, episodes: updatedEpisodes });
    setShowEpisodeModal(false);
    setEpTitle('');
    setEpInitialUrl('');
  };

  const handleAddEpSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeries || !selectedSeason || !selectedEpisode || !srcUrl.trim()) return;

    let updatedSources = [...selectedEpisode.sources];
    if (srcPriority === 1) {
      updatedSources = updatedSources.map((s) => ({ ...s, priority: s.priority + 1 }));
    }

    const newSrc: EpisodeSourceRecord = {
      id: `src-ep-${Date.now()}`,
      episode_id: selectedEpisode.id,
      url: srcUrl.trim(),
      format: srcFormat,
      is_active: true,
      priority: srcPriority,
      last_status: 'UNCHECKED',
      created_at: new Date().toISOString().split('T')[0],
    };

    const finalSources: EpisodeSourceRecord[] = [newSrc, ...updatedSources];
    const updatedEpisodes: EpisodeRecord[] = selectedSeason.episodes.map((ep) => ep.id === selectedEpisode.id ? { ...ep, sources: finalSources } : ep);
    const updatedSeasons: SeasonRecord[] = selectedSeries.seasons.map((se) => se.id === selectedSeason.id ? { ...se, episodes: updatedEpisodes } : se);

    setSeriesList(seriesList.map((s) => s.id === selectedSeries.id ? { ...s, seasons: updatedSeasons } : s));
    setSelectedSeries({ ...selectedSeries, seasons: updatedSeasons });
    setSelectedSeason({ ...selectedSeason, episodes: updatedEpisodes });
    setSelectedEpisode({ ...selectedEpisode, sources: finalSources });
    setShowAddEpSourceModal(false);
    setSrcUrl('');
  };

  // CAMBIO RÁPIDO DE FUENTE (⚡)
  const handleQuickSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qsTargetId || !qsNewUrl.trim()) return;

    if (qsContentType === 'TV') {
      const ch = channels.find((c) => c.id === qsTargetId);
      if (!ch) return;
      const updatedSources = ch.sources.map((s) => s.priority === 1 ? { ...s, priority: s.priority + 1 } : s);
      const newSrc: ChannelSourceRecord = {
        id: `src-qs-${Date.now()}`,
        channel_id: ch.id,
        url: qsNewUrl.trim(),
        format: qsFormat,
        is_active: true,
        priority: 1,
        last_status: 'WORKING',
        last_http_code: 200,
        last_response_time: 105,
        last_checked_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
        created_at: new Date().toISOString().split('T')[0],
      };
      const finalSources = [newSrc, ...updatedSources];
      setChannels(channels.map((c) => c.id === ch.id ? { ...c, sources: finalSources, is_active: true } : c));
      if (selectedChannelForSources?.id === ch.id) setSelectedChannelForSources({ ...selectedChannelForSources, sources: finalSources, is_active: true });
      alert(`⚡ Fuente reemplazada con éxito en Prioridad 1 para el canal ${ch.name}.`);
    } else if (qsContentType === 'MOVIE') {
      const m = movies.find((item) => item.id === qsTargetId);
      if (!m) return;
      const updatedSources = m.sources.map((s) => s.priority === 1 ? { ...s, priority: s.priority + 1 } : s);
      const newSrc: MovieSourceRecord = {
        id: `src-m-qs-${Date.now()}`,
        movie_id: m.id,
        url: qsNewUrl.trim(),
        format: qsFormat,
        is_active: true,
        priority: 1,
        last_status: 'WORKING',
        last_http_code: 200,
        last_response_time: 110,
        last_checked_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
        created_at: new Date().toISOString().split('T')[0],
      };
      const finalSources = [newSrc, ...updatedSources];
      setMovies(movies.map((item) => item.id === m.id ? { ...item, sources: finalSources, is_active: true } : item));
      if (selectedMovieForSources?.id === m.id) setSelectedMovieForSources({ ...selectedMovieForSources, sources: finalSources, is_active: true });
      alert(`⚡ Fuente reemplazada en Prioridad 1 para la película ${m.title}.`);
    }
    setShowQuickSwitchModal(false);
    setQsNewUrl('');
  };

  // Full Stats Summary
  const stats = {
    tvCategories: categories.filter((c) => c.type === 'TV' || c.type === 'ALL').length,
    tvChannels: channels.length,
    tvActiveChannels: channels.filter((c) => c.is_active).length,
    tvErrors: channels.flatMap((c) => c.sources).filter((s) => s.last_status === 'ERROR').length,

    moviesTotal: movies.length,
    moviesActive: movies.filter((m) => m.is_active).length,
    moviesWithoutSource: movies.filter((m) => !m.sources.some((s) => s.is_active)).length,

    seriesTotal: seriesList.length,
    seasonsTotal: seriesList.flatMap((s) => s.seasons).length,
    episodesTotal: seriesList.flatMap((s) => s.seasons).flatMap((se) => se.episodes).length,
  };

  if (!isAdminLoggedIn) {
    return (
      <div style={styles.loginOverlay}>
        <div style={styles.loginBox}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h1 style={{ fontSize: '32px', margin: 0, color: '#FFF' }}>
              NEXO<span style={{ color: '#E50914' }}>TV</span>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '6px' }}>Acceso Restringido - Panel Administrador</p>
          </div>
          {loginError && <div style={styles.errorAlert}>{loginError}</div>}
          <form onSubmit={handleAdminLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Usuario Administrador:</label>
              <input type="text" required value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="admin" style={styles.modalInput} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contraseña Administrador:</label>
              <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" style={styles.modalInput} />
            </div>
            <button type="submit" disabled={isAuthenticating} style={styles.btnLoginSubmit}>
              {isAuthenticating ? 'VERIFICANDO...' : 'INGRESAR AL PANEL'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      {/* Header Principal */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            NEXO<span style={{ color: '#E50914' }}>TV</span> - Panel Administrador
          </h1>
          <p style={styles.sub}>Sistema Integral de Gestión de Clientes & Contenido (TV en Vivo, Películas y Series)</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={styles.btnQuickSwitch} onClick={() => setShowQuickSwitchModal(true)}>
            ⚡ CAMBIO RÁPIDO DE FUENTE
          </button>
          <button style={styles.btnLogout} onClick={() => setIsAdminLoggedIn(false)}>
            🚪 CERRAR SESIÓN
          </button>
        </div>
      </header>

      {/* Navegador Principal */}
      <div style={styles.mainNavTabs}>
        <button style={mainSection === 'CONTENT' ? styles.mainTabActive : styles.mainTab} onClick={() => setMainSection('CONTENT')}>
          🎬 Contenido (TV, Películas & Series)
        </button>
        <button style={mainSection === 'CLIENTS' ? styles.mainTabActive : styles.mainTab} onClick={() => setMainSection('CLIENTS')}>
          👥 Gestión de Clientes ({users.length})
        </button>
      </div>

      {/* ==================================================== */}
      {/* 🎬 CENTRO DE CONTENIDO UNIFICADO                      */}
      {/* ==================================================== */}
      {mainSection === 'CONTENT' && (
        <div>
          {/* Métricas Unificadas */}
          <div style={styles.contentDashboardStats}>
            <div style={styles.statCard}>
              <span style={styles.statTitle}>TV CANALES</span>
              <p style={styles.statNumber}>{stats.tvChannels}</p>
              <span style={{ fontSize: '11px', color: '#34D399' }}>{stats.tvActiveChannels} Activos</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statTitle}>PELÍCULAS</span>
              <p style={styles.statNumber}>{stats.moviesTotal}</p>
              <span style={{ fontSize: '11px', color: '#34D399' }}>{stats.moviesActive} Activas</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statTitle}>SERIES VOD</span>
              <p style={styles.statNumber}>{stats.seriesTotal}</p>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{stats.seasonsTotal} Temporadas</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statTitle}>EPISODIOS TOT.</span>
              <p style={styles.statNumber}>{stats.episodesTotal}</p>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statTitle}>CATEGORÍAS</span>
              <p style={{ ...styles.statNumber, color: '#38BDF8' }}>{categories.length}</p>
            </div>
          </div>

          {/* Submódulos de Contenido */}
          <div style={styles.hubSubBar}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={contentHubModule === 'LIVE_TV' ? styles.hubTabActive : styles.hubTab} onClick={() => setContentHubModule('LIVE_TV')}>
                📺 TV en Vivo ({channels.length})
              </button>
              <button style={contentHubModule === 'MOVIES' ? styles.hubTabActive : styles.hubTab} onClick={() => setContentHubModule('MOVIES')}>
                🎬 Películas ({movies.length})
              </button>
              <button style={contentHubModule === 'SERIES' ? styles.hubTabActive : styles.hubTab} onClick={() => setContentHubModule('SERIES')}>
                📺 Series ({seriesList.length})
              </button>
              <button style={contentHubModule === 'CATEGORIES' ? styles.hubTabActive : styles.hubTab} onClick={() => setContentHubModule('CATEGORIES')}>
                📁 Categorías & Géneros ({categories.length})
              </button>
            </div>
          </div>

          {testFeedback && (
            <div style={testFeedback.includes('✅') ? styles.alertSuccess : styles.alertError}>
              <span>{testFeedback}</span>
              <button style={styles.btnCloseAlert} onClick={() => setTestFeedback(null)}>✕</button>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* MÓDULO 1: 📺 TV EN VIVO                              */}
          {/* ---------------------------------------------------- */}
          {contentHubModule === 'LIVE_TV' && (
            <div>
              <div style={styles.subBar}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={tvSubTab === 'CHANNELS' ? styles.subTabActive : styles.subTab} onClick={() => setTvSubTab('CHANNELS')}>
                    📺 Canales ({channels.length})
                  </button>
                  <button style={tvSubTab === 'SOURCES' ? styles.subTabActive : styles.subTab} onClick={() => setTvSubTab('SOURCES')}>
                    🔗 Fuentes & Historial
                  </button>
                </div>
                <button style={styles.btnPrimary} onClick={() => openChannelModal()}>+ CREAR CANAL</button>
              </div>

              {tvSubTab === 'CHANNELS' && (
                <div style={styles.tableCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>ORDEN</th>
                        <th>CANAL</th>
                        <th>CATEGORÍA</th>
                        <th>FUENTE ACTIVA (PRIORIDAD 1)</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channels.map((ch) => {
                        const activeSrc = ch.sources.find((s) => s.is_active);
                        return (
                          <tr key={ch.id}>
                            <td>#{ch.sort_order}</td>
                            <td><strong style={{ color: '#FFF' }}>{ch.name}</strong></td>
                            <td><span style={styles.categoryPill}>{ch.category_name}</span></td>
                            <td>
                              {activeSrc ? (
                                <div>
                                  <span style={styles.formatPill}>{activeSrc.format}</span>
                                  <span style={{ fontSize: '12px', color: '#CBD5E1', marginLeft: '6px' }}>{activeSrc.url.slice(0, 35)}...</span>
                                  <span style={{ ...(activeSrc.last_status === 'WORKING' ? styles.badgeSuccess : styles.badgeDanger), marginLeft: '8px' }}>
                                    {activeSrc.last_status === 'WORKING' ? '✅ Funcionando' : '❌ Error'}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 'bold' }}>⚠️ Sin fuente activa</span>
                              )}
                            </td>
                            <td><span style={ch.is_active ? styles.badgeSuccess : styles.badgeWarning}>{ch.is_active ? 'Activo' : 'Inactivo'}</span></td>
                            <td style={styles.actionsTd}>
                              <button style={styles.btnEdit} onClick={() => openChannelModal(ch)}>✏️ Editar</button>
                              <button style={styles.btnAction} onClick={() => { setSelectedChannelForSources(ch); setTvSubTab('SOURCES'); }}>🔗 Fuentes ({ch.sources.length})</button>
                              <button
                                style={ch.is_active ? styles.btnToggleInactive : styles.btnToggleActive}
                                onClick={() => setChannels(channels.map((c) => c.id === ch.id ? { ...c, is_active: !c.is_active } : c))}
                              >
                                {ch.is_active ? '🚫 Desactivar' : '✓ Activar'}
                              </button>
                              <button style={styles.btnDanger} onClick={() => setChannels(channels.filter((c) => c.id !== ch.id))}>🗑️</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {tvSubTab === 'SOURCES' && selectedChannelForSources && (
                <div>
                  <div style={styles.channelSelectorCard}>
                    <label style={{ color: '#94A3B8', fontWeight: 'bold', marginRight: '10px' }}>Canal Seleccionado:</label>
                    <select
                      value={selectedChannelForSources.id}
                      onChange={(e) => {
                        const found = channels.find((c) => c.id === e.target.value);
                        if (found) setSelectedChannelForSources(found);
                      }}
                      style={styles.selectLarge}
                    >
                      {channels.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.category_name}) - {c.sources.length} fuentes</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.tableCard}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0, color: '#FFF' }}>Historial de Fuentes de: {selectedChannelForSources.name}</h3>
                      <button style={styles.btnPrimary} onClick={() => setShowAddTvSourceModal(true)}>+ Agregar Fuente a Canal</button>
                    </div>

                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>PRIORIDAD</th>
                          <th>URL FUENTE</th>
                          <th>FORMATO</th>
                          <th>ESTADO</th>
                          <th>PRUEBA TÉCNICA</th>
                          <th>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedChannelForSources.sources.map((src) => (
                          <tr key={src.id}>
                            <td><span style={src.priority === 1 ? styles.priorityPillActive : styles.priorityPill}>Prioridad {src.priority}</span></td>
                            <td><code>{src.url}</code></td>
                            <td><span style={styles.formatPill}>{src.format}</span></td>
                            <td><span style={src.is_active ? styles.badgeSuccess : styles.badgeWarning}>{src.is_active ? 'Activa' : 'Inactiva'}</span></td>
                            <td><span style={src.last_status === 'WORKING' ? styles.badgeSuccess : styles.badgeDanger}>✅ {src.last_status} ({src.last_response_time || 110}ms)</span></td>
                            <td style={styles.actionsTd}>
                              <button
                                style={styles.btnAction}
                                disabled={testingId === src.id}
                                onClick={() => runTechnicalLinkTest(src.id, src.url, src.format, (st, code, ms) => {
                                  const updated = selectedChannelForSources.sources.map((s) => s.id === src.id ? { ...s, last_status: st, last_http_code: code, last_response_time: ms, last_checked_at: new Date().toISOString().slice(0, 16) } : s);
                                  setSelectedChannelForSources({ ...selectedChannelForSources, sources: updated });
                                  setChannels(channels.map((c) => c.id === selectedChannelForSources.id ? { ...c, sources: updated } : c));
                                })}
                              >
                                {testingId === src.id ? '⌛ Probando...' : '▶ Probar enlace'}
                              </button>
                              <button style={styles.btnSecondary} onClick={() => setPreviewStream({ url: src.url, format: src.format, title: selectedChannelForSources.name })}>🎬 Vista Previa</button>
                              {src.priority !== 1 && (
                                <button
                                  style={styles.btnPriority1}
                                  onClick={() => {
                                    const updated = selectedChannelForSources.sources.map((s) => s.id === src.id ? { ...s, priority: 1, is_active: true } : { ...s, priority: s.priority + 1 });
                                    setSelectedChannelForSources({ ...selectedChannelForSources, sources: updated });
                                    setChannels(channels.map((c) => c.id === selectedChannelForSources.id ? { ...c, sources: updated } : c));
                                  }}
                                >
                                  ⚡ Prioridad 1
                                </button>
                              )}
                              <button style={styles.btnDanger} onClick={() => {
                                const updated = selectedChannelForSources.sources.filter((s) => s.id !== src.id);
                                setSelectedChannelForSources({ ...selectedChannelForSources, sources: updated });
                                setChannels(channels.map((c) => c.id === selectedChannelForSources.id ? { ...c, sources: updated } : c));
                              }}>
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* MÓDULO 2: 🎬 PELÍCULAS                               */}
          {/* ---------------------------------------------------- */}
          {contentHubModule === 'MOVIES' && (
            <div>
              <div style={styles.subBar}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={movieSubTab === 'MOVIES' ? styles.subTabActive : styles.subTab} onClick={() => setMovieSubTab('MOVIES')}>🎬 Listado de Películas</button>
                  <button style={movieSubTab === 'SOURCES' ? styles.subTabActive : styles.subTab} onClick={() => setMovieSubTab('SOURCES')}>🔗 Fuentes & Historial</button>
                </div>
                <button style={styles.btnPrimary} onClick={() => openMovieModal()}>+ CREAR PELÍCULA</button>
              </div>

              {movieSubTab === 'MOVIES' && (
                <div style={styles.tableCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>POSTER</th>
                        <th>PELÍCULA</th>
                        <th>CATEGORÍA / GÉNERO</th>
                        <th>FUENTE ACTIVA (PRIORIDAD 1)</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map((m) => {
                        const activeSrc = m.sources.find((s) => s.is_active);
                        return (
                          <tr key={m.id}>
                            <td>{m.poster_url ? <img src={m.poster_url} style={{ width: '36px', height: '50px', borderRadius: '4px' }} /> : <span style={{ fontSize: '28px' }}>🎬</span>}</td>
                            <td>
                              <strong style={{ color: '#FFF' }}>{m.title}</strong>
                              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{m.year} • {m.duration}</div>
                            </td>
                            <td><span style={styles.categoryPill}>{m.genre || 'Acción'}</span></td>
                            <td>
                              {activeSrc ? (
                                <div>
                                  <span style={styles.formatPill}>{activeSrc.format}</span>
                                  <span style={{ fontSize: '12px', color: '#CBD5E1', marginLeft: '6px' }}>{activeSrc.url.slice(0, 35)}...</span>
                                  <span style={{ ...(activeSrc.last_status === 'WORKING' ? styles.badgeSuccess : styles.badgeDanger), marginLeft: '8px' }}>
                                    {activeSrc.last_status === 'WORKING' ? '✅ Funcionando' : '❌ Error'}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 'bold' }}>⚠️ Sin fuente activa</span>
                              )}
                            </td>
                            <td><span style={m.is_active ? styles.badgeSuccess : styles.badgeWarning}>{m.is_active ? 'Activa' : 'Inactiva'}</span></td>
                            <td style={styles.actionsTd}>
                              <button style={styles.btnEdit} onClick={() => openMovieModal(m)}>✏️ Editar</button>
                              <button style={styles.btnAction} onClick={() => { setSelectedMovieForSources(m); setMovieSubTab('SOURCES'); }}>🔗 Fuentes ({m.sources.length})</button>
                              <button
                                style={m.is_active ? styles.btnToggleInactive : styles.btnToggleActive}
                                onClick={() => setMovies(movies.map((item) => item.id === m.id ? { ...item, is_active: !item.is_active } : item))}
                              >
                                {m.is_active ? '🚫 Desactivar' : '✓ Activar'}
                              </button>
                              <button style={styles.btnDanger} onClick={() => setMovies(movies.filter((item) => item.id !== m.id))}>🗑️</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {movieSubTab === 'SOURCES' && selectedMovieForSources && (
                <div>
                  <div style={styles.channelSelectorCard}>
                    <label style={{ color: '#94A3B8', fontWeight: 'bold', marginRight: '10px' }}>Película Seleccionada:</label>
                    <select
                      value={selectedMovieForSources.id}
                      onChange={(e) => {
                        const found = movies.find((m) => m.id === e.target.value);
                        if (found) setSelectedMovieForSources(found);
                      }}
                      style={styles.selectLarge}
                    >
                      {movies.map((m) => (
                        <option key={m.id} value={m.id}>{m.title} ({m.year}) - {m.sources.length} fuentes</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.tableCard}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0, color: '#FFF' }}>Historial de Fuentes de Película: {selectedMovieForSources.title}</h3>
                      <button style={styles.btnPrimary} onClick={() => setShowAddMovieSourceModal(true)}>+ Agregar Fuente a Película</button>
                    </div>

                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>PRIORIDAD</th>
                          <th>URL FUENTE</th>
                          <th>FORMATO</th>
                          <th>ESTADO</th>
                          <th>PRUEBA TÉCNICA</th>
                          <th>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMovieForSources.sources.map((src) => (
                          <tr key={src.id}>
                            <td><span style={src.priority === 1 ? styles.priorityPillActive : styles.priorityPill}>Prioridad {src.priority}</span></td>
                            <td><code>{src.url}</code></td>
                            <td><span style={styles.formatPill}>{src.format}</span></td>
                            <td><span style={src.is_active ? styles.badgeSuccess : styles.badgeWarning}>{src.is_active ? 'Activa' : 'Inactiva'}</span></td>
                            <td><span style={src.last_status === 'WORKING' ? styles.badgeSuccess : styles.badgeDanger}>✅ {src.last_status} ({src.last_response_time || 125}ms)</span></td>
                            <td style={styles.actionsTd}>
                              <button
                                style={styles.btnAction}
                                disabled={testingId === src.id}
                                onClick={() => runTechnicalLinkTest(src.id, src.url, src.format, (st, code, ms) => {
                                  const updated = selectedMovieForSources.sources.map((s) => s.id === src.id ? { ...s, last_status: st, last_http_code: code, last_response_time: ms, last_checked_at: new Date().toISOString().slice(0, 16) } : s);
                                  setSelectedMovieForSources({ ...selectedMovieForSources, sources: updated });
                                  setMovies(movies.map((m) => m.id === selectedMovieForSources.id ? { ...m, sources: updated } : m));
                                })}
                              >
                                {testingId === src.id ? '⌛ Probando...' : '▶ Probar enlace'}
                              </button>
                              <button style={styles.btnSecondary} onClick={() => setPreviewStream({ url: src.url, format: src.format, title: selectedMovieForSources.title })}>🎬 Vista Previa</button>
                              {src.priority !== 1 && (
                                <button
                                  style={styles.btnPriority1}
                                  onClick={() => {
                                    const updated = selectedMovieForSources.sources.map((s) => s.id === src.id ? { ...s, priority: 1, is_active: true } : { ...s, priority: s.priority + 1 });
                                    setSelectedMovieForSources({ ...selectedMovieForSources, sources: updated });
                                    setMovies(movies.map((m) => m.id === selectedMovieForSources.id ? { ...m, sources: updated } : m));
                                  }}
                                >
                                  ⚡ Prioridad 1
                                </button>
                              )}
                              <button style={styles.btnDanger} onClick={() => {
                                const updated = selectedMovieForSources.sources.filter((s) => s.id !== src.id);
                                setSelectedMovieForSources({ ...selectedMovieForSources, sources: updated });
                                setMovies(movies.map((m) => m.id === selectedMovieForSources.id ? { ...m, sources: updated } : m));
                              }}>
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* MÓDULO 3: 📺 SERIES & EPISODIOS                      */}
          {/* ---------------------------------------------------- */}
          {contentHubModule === 'SERIES' && (
            <div>
              <div style={styles.subBar}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={seriesSubTab === 'SERIES' ? styles.subTabActive : styles.subTab} onClick={() => setSeriesSubTab('SERIES')}>📺 Listado de Series</button>
                  <button style={seriesSubTab === 'SEASONS' ? styles.subTabActive : styles.subTab} onClick={() => setSeriesSubTab('SEASONS')}>📚 Temporadas & Episodios</button>
                  <button style={seriesSubTab === 'EPISODE_SOURCES' ? styles.subTabActive : styles.subTab} onClick={() => setSeriesSubTab('EPISODE_SOURCES')}>🔗 Fuentes por Episodio</button>
                </div>
                <button style={styles.btnPrimary} onClick={() => openSeriesModal()}>+ CREAR SERIE</button>
              </div>

              {seriesSubTab === 'SERIES' && (
                <div style={styles.tableCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>POSTER</th>
                        <th>TÍTULO SERIE</th>
                        <th>GÉNERO</th>
                        <th>TEMPORADAS</th>
                        <th>EPISODIOS</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seriesList.map((s) => {
                        const totalEp = s.seasons.reduce((acc, se) => acc + se.episodes.length, 0);
                        return (
                          <tr key={s.id}>
                            <td>{s.poster_url ? <img src={s.poster_url} style={{ width: '36px', height: '50px', borderRadius: '4px' }} /> : <span style={{ fontSize: '28px' }}>📺</span>}</td>
                            <td><strong style={{ color: '#FFF' }}>{s.title}</strong></td>
                            <td><span style={styles.categoryPill}>{s.genre || 'Drama'}</span></td>
                            <td><span style={styles.planBadge}>{s.seasons.length} Temp.</span></td>
                            <td><span style={styles.planBadge}>{totalEp} Ep.</span></td>
                            <td><span style={s.is_active ? styles.badgeSuccess : styles.badgeWarning}>{s.is_active ? 'Activa' : 'Inactiva'}</span></td>
                            <td style={styles.actionsTd}>
                              <button style={styles.btnEdit} onClick={() => openSeriesModal(s)}>✏️ Editar</button>
                              <button style={styles.btnAction} onClick={() => { setSelectedSeries(s); setSeriesSubTab('SEASONS'); }}>📚 Temporadas & Ep.</button>
                              <button
                                style={s.is_active ? styles.btnToggleInactive : styles.btnToggleActive}
                                onClick={() => setSeriesList(seriesList.map((item) => item.id === s.id ? { ...item, is_active: !item.is_active } : item))}
                              >
                                {s.is_active ? '🚫 Desactivar' : '✓ Activar'}
                              </button>
                              <button style={styles.btnDanger} onClick={() => setSeriesList(seriesList.filter((item) => item.id !== s.id))}>🗑️</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {seriesSubTab === 'SEASONS' && selectedSeries && (
                <div>
                  <div style={styles.channelSelectorCard}>
                    <label style={{ color: '#94A3B8', fontWeight: 'bold', marginRight: '10px' }}>Serie Seleccionada:</label>
                    <select
                      value={selectedSeries.id}
                      onChange={(e) => {
                        const found = seriesList.find((s) => s.id === e.target.value);
                        if (found) {
                          setSelectedSeries(found);
                          if (found.seasons.length > 0) setSelectedSeason(found.seasons[0]);
                        }
                      }}
                      style={styles.selectLarge}
                    >
                      {seriesList.map((s) => (
                        <option key={s.id} value={s.id}>{s.title} ({s.seasons.length} Temp.)</option>
                      ))}
                    </select>

                    <button style={{ ...styles.btnPrimary, marginLeft: 'auto' }} onClick={() => { setSeasonNum(selectedSeries.seasons.length + 1); setSeasonTitleText(`Temporada ${selectedSeries.seasons.length + 1}`); setShowSeasonModal(true); }}>
                      + Agregar Temporada
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    {selectedSeries.seasons.map((se) => (
                      <button key={se.id} style={selectedSeason?.id === se.id ? styles.mainTabActive : styles.mainTab} onClick={() => setSelectedSeason(se)}>
                        {se.title || `Temporada ${se.season_number}`} ({se.episodes.length} Ep.)
                      </button>
                    ))}
                  </div>

                  {selectedSeason && (
                    <div style={styles.tableCard}>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0, color: '#FFF' }}>Episodios de {selectedSeries.title} - {selectedSeason.title}</h3>
                        <button style={styles.btnPrimary} onClick={() => { setEpNum(selectedSeason.episodes.length + 1); setShowEpisodeModal(true); }}>+ Agregar Episodio</button>
                      </div>

                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th>Nº EP.</th>
                            <th>TÍTULO EPISODIO</th>
                            <th>DURACIÓN</th>
                            <th>FUENTE ACTIVA (PRIORIDAD 1)</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedSeason.episodes.map((ep) => {
                            const activeSrc = ep.sources.find((s) => s.is_active);
                            return (
                              <tr key={ep.id}>
                                <td><strong>Ep. {ep.episode_number}</strong></td>
                                <td style={{ color: '#FFF' }}>{ep.title}</td>
                                <td>{ep.duration}</td>
                                <td>
                                  {activeSrc ? (
                                    <div>
                                      <span style={styles.formatPill}>{activeSrc.format}</span>
                                      <span style={{ fontSize: '12px', color: '#CBD5E1', marginLeft: '6px' }}>{activeSrc.url.slice(0, 30)}...</span>
                                    </div>
                                  ) : (
                                    <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 'bold' }}>⚠️ Sin fuente activa</span>
                                  )}
                                </td>
                                <td><span style={ep.is_active ? styles.badgeSuccess : styles.badgeWarning}>{ep.is_active ? 'Activo' : 'Inactivo'}</span></td>
                                <td style={styles.actionsTd}>
                                  <button style={styles.btnEdit} onClick={() => { setEditEpisode(ep); setEpNum(ep.episode_number); setEpTitle(ep.title); setEpDuration(ep.duration || '45m'); setEpSynopsis(ep.synopsis || ''); setShowEpisodeModal(true); }}>✏️ Editar</button>
                                  <button style={styles.btnAction} onClick={() => { setSelectedEpisode(ep); setSeriesSubTab('EPISODE_SOURCES'); }}>🔗 Fuentes ({ep.sources.length})</button>
                                  <button style={styles.btnDanger} onClick={() => {
                                    const updatedEp = selectedSeason.episodes.filter((e) => e.id !== ep.id);
                                    const updatedSeasons = selectedSeries.seasons.map((se) => se.id === selectedSeason.id ? { ...se, episodes: updatedEp } : se);
                                    setSeriesList(seriesList.map((s) => s.id === selectedSeries.id ? { ...s, seasons: updatedSeasons } : s));
                                    setSelectedSeries({ ...selectedSeries, seasons: updatedSeasons });
                                    setSelectedSeason({ ...selectedSeason, episodes: updatedEp });
                                  }}>
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {seriesSubTab === 'EPISODE_SOURCES' && selectedEpisode && (
                <div>
                  <div style={styles.channelSelectorCard}>
                    <label style={{ color: '#94A3B8', fontWeight: 'bold', marginRight: '10px' }}>Episodio Seleccionado:</label>
                    <select
                      value={selectedEpisode.id}
                      onChange={(e) => {
                        const found = selectedSeason?.episodes.find((ep) => ep.id === e.target.value);
                        if (found) setSelectedEpisode(found);
                      }}
                      style={styles.selectLarge}
                    >
                      {selectedSeason?.episodes.map((ep) => (
                        <option key={ep.id} value={ep.id}>Ep. {ep.episode_number}: {ep.title} - {ep.sources.length} fuentes</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.tableCard}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0, color: '#FFF' }}>Fuentes de Episodio: {selectedEpisode.title}</h3>
                      <button style={styles.btnPrimary} onClick={() => setShowAddEpSourceModal(true)}>+ Agregar Fuente a Episodio</button>
                    </div>

                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>PRIORIDAD</th>
                          <th>URL FUENTE</th>
                          <th>FORMATO</th>
                          <th>ESTADO</th>
                          <th>PRUEBA TÉCNICA</th>
                          <th>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEpisode.sources.map((src) => (
                          <tr key={src.id}>
                            <td><span style={src.priority === 1 ? styles.priorityPillActive : styles.priorityPill}>Prioridad {src.priority}</span></td>
                            <td><code>{src.url}</code></td>
                            <td><span style={styles.formatPill}>{src.format}</span></td>
                            <td><span style={src.is_active ? styles.badgeSuccess : styles.badgeWarning}>{src.is_active ? 'Activa' : 'Inactiva'}</span></td>
                            <td><span style={src.last_status === 'WORKING' ? styles.badgeSuccess : styles.badgeDanger}>✅ {src.last_status} ({src.last_response_time || 140}ms)</span></td>
                            <td style={styles.actionsTd}>
                              <button
                                style={styles.btnAction}
                                disabled={testingId === src.id}
                                onClick={() => runTechnicalLinkTest(src.id, src.url, src.format, (st, code, ms) => {
                                  const updatedSources = selectedEpisode.sources.map((s) => s.id === src.id ? { ...s, last_status: st, last_http_code: code, last_response_time: ms, last_checked_at: new Date().toISOString().slice(0, 16) } : s);
                                  setSelectedEpisode({ ...selectedEpisode, sources: updatedSources });
                                })}
                              >
                                {testingId === src.id ? '⌛ Probando...' : '▶ Probar enlace'}
                              </button>
                              <button style={styles.btnSecondary} onClick={() => setPreviewStream({ url: src.url, format: src.format, title: selectedEpisode.title })}>🎬 Vista Previa</button>
                              {src.priority !== 1 && (
                                <button
                                  style={styles.btnPriority1}
                                  onClick={() => {
                                    const updatedSources = selectedEpisode.sources.map((s) => s.id === src.id ? { ...s, priority: 1, is_active: true } : { ...s, priority: s.priority + 1 });
                                    setSelectedEpisode({ ...selectedEpisode, sources: updatedSources });
                                  }}
                                >
                                  ⚡ Prioridad 1
                                </button>
                              )}
                              <button style={styles.btnDanger} onClick={() => {
                                const updatedSources = selectedEpisode.sources.filter((s) => s.id !== src.id);
                                setSelectedEpisode({ ...selectedEpisode, sources: updatedSources });
                              }}>
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* MÓDULO 4: 📁 CATEGORÍAS & GÉNEROS                    */}
          {/* ---------------------------------------------------- */}
          {contentHubModule === 'CATEGORIES' && (
            <div style={styles.tableCard}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, color: '#FFF' }}>Gestión de Categorías & Géneros Reutilizables</h3>
                <button style={styles.btnPrimary} onClick={() => { setEditCategory(null); setShowCategoryModal(true); }}>+ CREAR CATEGORÍA</button>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>ORDEN</th>
                    <th>NOMBRE CATEGORÍA</th>
                    <th>SLUG</th>
                    <th>TIPO DE CONTENIDO</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.sort_order}</td>
                      <td><strong style={{ color: '#FFF' }}>{c.name}</strong></td>
                      <td><code>{c.slug}</code></td>
                      <td><span style={styles.categoryPill}>{c.type}</span></td>
                      <td><span style={c.is_active ? styles.badgeSuccess : styles.badgeWarning}>{c.is_active ? 'Activa' : 'Inactiva'}</span></td>
                      <td style={styles.actionsTd}>
                        <button style={styles.btnEdit} onClick={() => { setEditCategory(c); setCatName(c.name); setCatSlug(c.slug); setCatType(c.type); setShowCategoryModal(true); }}>✏️ Editar</button>
                        <button style={styles.btnDanger} onClick={() => setCategories(categories.filter((cat) => cat.id !== c.id))}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 👥 SECCIÓN DE CLIENTES                                */}
      {/* ==================================================== */}
      {mainSection === 'CLIENTS' && (
        <div style={styles.tableCard}>
          <div style={{ padding: '20px', color: '#FFF' }}>
            <h2>Gestión de Suscripciones y Clientes</h2>
            <p style={{ color: '#94A3B8' }}>Total de clientes activos en el sistema: {users.length}</p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODALES DEL SISTEMA                                  */}
      {/* ==================================================== */}

      {/* MODAL: Crear/Editar Canal */}
      {showChannelModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2>{editChannel ? 'Editar Canal' : 'Crear Nuevo Canal de TV'}</h2>
            <form onSubmit={handleSaveChannel}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Canal:</label>
                <input type="text" required value={chName} onChange={(e) => setChName(e.target.value)} style={styles.modalInput} placeholder="Ej: Telefe HD" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Categoría:</label>
                <select value={chCategoryId} onChange={(e) => setChCategoryId(e.target.value)} style={styles.modalInput}>
                  {categories.filter((c) => c.type === 'TV' || c.type === 'ALL').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {!editChannel && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>URL Fuente Inicial (HLS / MP4):</label>
                  <input type="url" value={chInitialUrl} onChange={(e) => setChInitialUrl(e.target.value)} style={styles.modalInput} placeholder="https://..." />
                </div>
              )}
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowChannelModal(false)}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>Guardar Canal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Crear/Editar Película */}
      {showMovieModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2>{editMovie ? 'Editar Película' : 'Crear Nueva Película'}</h2>
            <form onSubmit={handleSaveMovie}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Título de la Película:</label>
                <input type="text" required value={mTitle} onChange={(e) => setMTitle(e.target.value)} style={styles.modalInput} placeholder="Ej: John Wick" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Título Original:</label>
                <input type="text" value={mOriginalTitle} onChange={(e) => setMOriginalTitle(e.target.value)} style={styles.modalInput} placeholder="Ej: John Wick (2014)" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Género:</label>
                <select value={mGenre} onChange={(e) => setMGenre(e.target.value)} style={styles.modalInput}>
                  <option value="Acción">Acción</option>
                  <option value="Comedia">Comedia</option>
                  <option value="Terror">Terror</option>
                  <option value="Ciencia Ficción">Ciencia Ficción</option>
                  <option value="Drama">Drama</option>
                  <option value="Animación">Animación</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Año:</label>
                <input type="number" value={mYear} onChange={(e) => setMYear(parseInt(e.target.value, 10))} style={styles.modalInput} />
              </div>
              {!editMovie && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>URL Fuente Inicial (MP4 / HLS):</label>
                  <input type="url" value={mInitialUrl} onChange={(e) => setMInitialUrl(e.target.value)} style={styles.modalInput} placeholder="https://..." />
                </div>
              )}
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowMovieModal(false)}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>Guardar Película</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Crear/Editar Serie */}
      {showSeriesModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2>{editSeriesItem ? 'Editar Serie' : 'Crear Nueva Serie'}</h2>
            <form onSubmit={handleSaveSeries}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Serie:</label>
                <input type="text" required value={sTitle} onChange={(e) => setSTitle(e.target.value)} style={styles.modalInput} placeholder="Ej: The Walking Dead" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Género:</label>
                <select value={sGenre} onChange={(e) => setSGenre(e.target.value)} style={styles.modalInput}>
                  <option value="Drama">Drama</option>
                  <option value="Acción">Acción</option>
                  <option value="Comedia">Comedia</option>
                  <option value="Ciencia Ficción">Ciencia Ficción</option>
                  <option value="Terror">Terror</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowSeriesModal(false)}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>Guardar Serie</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Crear Episodio */}
      {showEpisodeModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2>{editEpisode ? 'Editar Episodio' : 'Agregar Episodio'}</h2>
            <form onSubmit={handleAddEpisode}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Número de Episodio:</label>
                <input type="number" required value={epNum} onChange={(e) => setEpNum(parseInt(e.target.value, 10))} style={styles.modalInput} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Título del Episodio:</label>
                <input type="text" required value={epTitle} onChange={(e) => setEpTitle(e.target.value)} style={styles.modalInput} placeholder="Ej: El comienzo" />
              </div>
              {!editEpisode && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>URL Fuente Inicial (HLS / MP4):</label>
                  <input type="url" value={epInitialUrl} onChange={(e) => setEpInitialUrl(e.target.value)} style={styles.modalInput} placeholder="https://..." />
                </div>
              )}
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowEpisodeModal(false)}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>Guardar Episodio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Agregar Fuente a Canal */}
      {showAddTvSourceModal && selectedChannelForSources && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2>Agregar Fuente a {selectedChannelForSources.name}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!srcUrl.trim()) return;
              let updatedSources = [...selectedChannelForSources.sources];
              if (srcPriority === 1) updatedSources = updatedSources.map((s) => ({ ...s, priority: s.priority + 1 }));
              const newSrc: ChannelSourceRecord = {
                id: `src-${Date.now()}`,
                channel_id: selectedChannelForSources.id,
                url: srcUrl.trim(),
                format: srcFormat,
                is_active: true,
                priority: srcPriority,
                last_status: 'UNCHECKED',
                created_at: new Date().toISOString().split('T')[0],
              };
              const finalSources = [newSrc, ...updatedSources];
              setSelectedChannelForSources({ ...selectedChannelForSources, sources: finalSources });
              setChannels(channels.map((c) => c.id === selectedChannelForSources.id ? { ...c, sources: finalSources } : c));
              setShowAddTvSourceModal(false);
              setSrcUrl('');
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL de Streaming:</label>
                <input type="url" required value={srcUrl} onChange={(e) => setSrcUrl(e.target.value)} style={styles.modalInput} placeholder="https://..." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Formato:</label>
                <select value={srcFormat} onChange={(e) => setSrcFormat(e.target.value as StreamFormat)} style={styles.modalInput}>
                  <option value="HLS">HLS (.m3u8)</option>
                  <option value="MP4">MP4 Video</option>
                  <option value="DASH">MPEG-DASH (.mpd)</option>
                  <option value="WEBM">WebM</option>
                  <option value="CUSTOM">Otro / URL Personalizada</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowAddTvSourceModal(false)}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>Guardar Fuente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Agregar Fuente a Película */}
      {showAddMovieSourceModal && selectedMovieForSources && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2>Agregar Fuente a {selectedMovieForSources.title}</h2>
            <form onSubmit={handleAddMovieSource}>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL de Streaming:</label>
                <input type="url" required value={srcUrl} onChange={(e) => setSrcUrl(e.target.value)} style={styles.modalInput} placeholder="https://..." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Formato:</label>
                <select value={srcFormat} onChange={(e) => setSrcFormat(e.target.value as StreamFormat)} style={styles.modalInput}>
                  <option value="MP4">MP4 Video</option>
                  <option value="HLS">HLS (.m3u8)</option>
                  <option value="DASH">MPEG-DASH (.mpd)</option>
                  <option value="WEBM">WebM</option>
                  <option value="CUSTOM">Otro / Personalizada</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowAddMovieSourceModal(false)}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>Guardar Fuente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Agregar Fuente a Episodio */}
      {showAddEpSourceModal && selectedEpisode && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2>Agregar Fuente a Episodio: {selectedEpisode.title}</h2>
            <form onSubmit={handleAddEpSource}>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL de Streaming:</label>
                <input type="url" required value={srcUrl} onChange={(e) => setSrcUrl(e.target.value)} style={styles.modalInput} placeholder="https://..." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Formato:</label>
                <select value={srcFormat} onChange={(e) => setSrcFormat(e.target.value as StreamFormat)} style={styles.modalInput}>
                  <option value="HLS">HLS (.m3u8)</option>
                  <option value="MP4">MP4 Video</option>
                  <option value="DASH">MPEG-DASH (.mpd)</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowAddEpSourceModal(false)}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>Guardar Fuente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Cambio Rápido de Fuente (⚡) */}
      {showQuickSwitchModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={{ color: '#FBBF24', margin: '0 0 10px 0' }}>⚡ Cambio Rápido de Fuente de Transmisión</h2>
            <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '15px' }}>Sustituye inmediatamente la fuente en Prioridad 1 sin actualizar la APK.</p>
            <form onSubmit={handleQuickSwitch}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Contenido:</label>
                <select value={qsContentType} onChange={(e) => setQsContentType(e.target.value as any)} style={styles.modalInput}>
                  <option value="TV">📺 Canal de TV en Vivo</option>
                  <option value="MOVIE">🎬 Película</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Seleccionar Item:</label>
                {qsContentType === 'TV' ? (
                  <select value={qsTargetId} onChange={(e) => setQsTargetId(e.target.value)} style={styles.modalInput}>
                    <option value="">-- Selecciona un canal --</option>
                    {channels.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.category_name})</option>
                    ))}
                  </select>
                ) : (
                  <select value={qsTargetId} onChange={(e) => setQsTargetId(e.target.value)} style={styles.modalInput}>
                    <option value="">-- Selecciona una película --</option>
                    {movies.map((m) => (
                      <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
                    ))}
                  </select>
                )}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nueva URL de Reproducción Funcionando:</label>
                <input type="url" required value={qsNewUrl} onChange={(e) => setQsNewUrl(e.target.value)} style={styles.modalInput} placeholder="https://..." />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowQuickSwitchModal(false)}>Cancelar</button>
                <button type="submit" style={styles.btnQuickSwitchSubmit}>⚡ Aplicar Cambio Rápido</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reproductor Vista Previa */}
      {previewStream && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalBox, width: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#FFF' }}>🎬 Vista Previa: {previewStream.title}</h3>
              <button style={styles.btnCloseAlert} onClick={() => setPreviewStream(null)}>✕</button>
            </div>
            <video ref={videoRef} controls autoPlay playsInline style={{ width: '100%', height: '320px', backgroundColor: '#000', borderRadius: '8px' }} src={previewStream.format !== 'HLS' ? previewStream.url : undefined} />
            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={() => setPreviewStream(null)}>Cerrar Reproductor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos Visuales NexoTV Dark Theme
const styles: Record<string, React.CSSProperties> = {
  loginOverlay: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
  loginBox: { backgroundColor: '#1E293B', width: '400px', padding: '36px', borderRadius: '16px', border: '1px solid #334155' },
  errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#F87171', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '6px', fontWeight: 600 },
  btnLoginSubmit: { width: '100%', backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  btnLogout: { backgroundColor: '#334155', color: '#F8FAFC', border: '1px solid #475569', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  btnQuickSwitch: { backgroundColor: '#F59E0B', color: '#0F172A', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  btnQuickSwitchSubmit: { backgroundColor: '#F59E0B', color: '#0F172A', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  appContainer: { padding: '30px', maxWidth: '1450px', margin: '0 auto', color: '#F8FAFC' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '15px' },
  title: { margin: 0, fontSize: '28px' },
  sub: { margin: '5px 0 0 0', color: '#94A3B8' },
  mainNavTabs: { display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '2px solid #334155', paddingBottom: '10px' },
  mainTab: { backgroundColor: 'transparent', color: '#94A3B8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  mainTabActive: { backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)' },
  contentDashboardStats: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '25px' },
  statCard: { backgroundColor: '#1E293B', borderRadius: '12px', padding: '16px', border: '1px solid #334155' },
  statTitle: { fontSize: '11px', color: '#94A3B8', fontWeight: 'bold' },
  statNumber: { fontSize: '26px', fontWeight: '900', margin: '4px 0' },
  hubSubBar: { backgroundColor: '#1E293B', padding: '12px 18px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '20px' },
  hubTab: { backgroundColor: 'transparent', color: '#94A3B8', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  hubTabActive: { backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  subBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#1E293B', padding: '12px 18px', borderRadius: '12px', border: '1px solid #334155' },
  subTab: { backgroundColor: 'transparent', color: '#94A3B8', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  subTabActive: { backgroundColor: '#334155', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  btnPrimary: { backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  btnSecondary: { backgroundColor: '#475569', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  btnDanger: { backgroundColor: '#991B1B', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' },
  btnEdit: { backgroundColor: '#D97706', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  btnAction: { backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  btnPriority1: { backgroundColor: '#F59E0B', color: '#0F172A', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  btnToggleActive: { backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  btnToggleInactive: { backgroundColor: '#64748B', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  tableCard: { backgroundColor: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  planBadge: { backgroundColor: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
  categoryPill: { backgroundColor: '#1E3A8A', color: '#93C5FD', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  formatPill: { backgroundColor: '#374151', color: '#F3F4F6', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  priorityPill: { backgroundColor: '#334155', color: '#94A3B8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  priorityPillActive: { backgroundColor: '#F59E0B', color: '#0F172A', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  badgeSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px' },
  badgeWarning: { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px' },
  badgeDanger: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px' },
  alertSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#34D399', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' },
  alertError: { backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#F87171', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' },
  btnCloseAlert: { background: 'none', border: 'none', color: '#FFF', fontSize: '16px', cursor: 'pointer' },
  actionsTd: { display: 'flex', gap: '6px', padding: '12px', alignItems: 'center' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalBox: { backgroundColor: '#1E293B', padding: '28px', borderRadius: '14px', width: '500px', border: '1px solid #334155' },
  formGroup: { marginBottom: '15px' },
  modalInput: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0F172A', color: '#FFF', marginTop: '5px', boxSizing: 'border-box' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' },
  channelSelectorCard: { backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '20px', display: 'flex', alignItems: 'center' },
  selectLarge: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0F172A', color: '#FFF', fontSize: '14px', minWidth: '300px' },
};
