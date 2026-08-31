import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, useWindowDimensions } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { CHANNELS_CATALOG, MOVIES_CATALOG, SERIES_CATALOG, Channel, Movie, Series } from '../services/contentCatalog';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { COLORS } from '../theme/colors';

export const MyListScreen: React.FC = () => {
  const { favoriteChannels, favoriteMovies, toggleFavoriteChannel, toggleFavoriteMovie } = useFavorites();
  const { width, height } = useWindowDimensions();
  const isMobile = Math.min(width, height) < 768;

  const [activeTab, setActiveTab] = useState<'CHANNELS' | 'VOD'>('CHANNELS');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStreamUrl, setActiveStreamUrl] = useState<string | null>(null);
  const [activeStreamTitle, setActiveStreamTitle] = useState<string>('');
  const [channels, setChannels] = useState<Channel[]>(CHANNELS_CATALOG);
  const [movies, setMovies] = useState<Movie[]>(MOVIES_CATALOG);
  const [series, setSeries] = useState<Series[]>(SERIES_CATALOG);

  // Cargar lista dinámica de canales y VOD desde la API backend NestJS
  useEffect(() => {
    fetch('https://nexotv-necn.onrender.com/api/v1/tv/live')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const loadedChannels: Channel[] = [];
          data.forEach((cat: any) => {
            if (Array.isArray(cat.channels)) {
              cat.channels.forEach((ch: any) => {
                loadedChannels.push({
                  id: ch.id,
                  name: ch.name,
                  category: cat.name,
                  number: ch.sort_order || 1,
                  logoUrl: ch.logo_url,
                  logoEmoji: ch.logo_emoji || '📺',
                  nowPlaying: ch.description || 'Transmisión en Vivo HD',
                  streamUrl: ch.active_source?.url || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                  isHD: true,
                });
              });
            }
          });
          if (loadedChannels.length > 0) {
            setChannels((prev) => [...loadedChannels, ...prev]);
          }
        }
      })
      .catch(() => {});

    fetch('https://nexotv-necn.onrender.com/api/v1/vod/movies/feed')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const loadedMovies: Movie[] = data.map((m: any) => ({
            id: m.id,
            title: m.title,
            category: (m.genre || m.category || 'Acción').toUpperCase(),
            year: m.year || 2026,
            duration: m.duration || '2h 00m',
            rating: m.rating || 'IMDb 8.0',
            synopsis: m.synopsis || 'Película disponible en streaming HD.',
            posterEmoji: m.poster_emoji || '🎬',
            posterUrl: m.poster_url,
            streamUrl: m.active_source?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }));
          setMovies((prev) => [...loadedMovies, ...prev]);
        }
      })
      .catch(() => {});
  }, []);

  // Filtrado de Favoritos por ID o Nombre/Título
  const favChannelsList = channels.filter(
    (ch) => favoriteChannels.includes(ch.id) || favoriteChannels.includes(ch.name)
  ).filter(
    (ch) =>
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favMoviesList = movies.filter(
    (m) => favoriteMovies.includes(m.id) || favoriteMovies.includes(m.title)
  ).filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favSeriesList = series.filter(
    (s) => favoriteMovies.includes(s.id) || favoriteMovies.includes(s.title)
  ).filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayChannel = (ch: Channel) => {
    setActiveStreamUrl(ch.streamUrl);
    setActiveStreamTitle(ch.name);
  };

  const handlePlayMovie = (m: Movie) => {
    setActiveStreamUrl(m.streamUrl);
    setActiveStreamTitle(m.title);
  };

  const handlePlaySeries = (s: Series) => {
    if (s.episodes && s.episodes.length > 0) {
      setActiveStreamUrl(s.episodes[0].streamUrl);
      setActiveStreamTitle(`${s.title} - Cap. 1`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header & Search */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>⭐ MI LISTA & FAVORITOS</Text>

        {/* Buscador 🔍 */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en tu lista de favoritos..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Tabs de Filtro */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'CHANNELS' && styles.tabBtnActive]}
            onPress={() => setActiveTab('CHANNELS')}
          >
            <Text style={[styles.tabText, activeTab === 'CHANNELS' && styles.tabTextActive]}>
              📡 Canales Favoritos ({favChannelsList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'VOD' && styles.tabBtnActive]}
            onPress={() => setActiveTab('VOD')}
          >
            <Text style={[styles.tabText, activeTab === 'VOD' && styles.tabTextActive]}>
              🎬 Películas & Series Guardadas ({favMoviesList.length + favSeriesList.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido Principal */}
      <ScrollView contentContainerStyle={styles.contentGrid}>
        {activeTab === 'CHANNELS' ? (
          favChannelsList.length > 0 ? (
            <View style={styles.channelsGrid}>
              {favChannelsList.map((ch, idx) => (
                <View key={`${ch.id}-${idx}`} style={styles.channelCard}>
                  <TouchableOpacity style={styles.channelInfoArea} onPress={() => handlePlayChannel(ch)}>
                    <View style={styles.logoBox}>
                      {ch.logoUrl ? (
                        <Image source={{ uri: ch.logoUrl }} style={styles.logoImage} resizeMode="contain" />
                      ) : (
                        <Text style={styles.logoEmoji}>{ch.logoEmoji}</Text>
                      )}
                    </View>
                    <View style={styles.detailsBox}>
                      <Text style={styles.channelName} numberOfLines={1}>
                        {ch.name}
                      </Text>

                      <View style={styles.badgesRow}>
                        <Text style={styles.categoryBadge}>{ch.category}</Text>

                        <Text style={styles.hdBadge}>{ch.isHD ? 'HD 1080p' : 'SD'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.starBtn}
                    onPress={() => {
                      toggleFavoriteChannel(ch.id);
                      toggleFavoriteChannel(ch.name);
                    }}
                  >
                    <Text style={styles.starText}>⭐</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📡</Text>
              <Text style={styles.emptyTitle}>No tenés canales en tu lista</Text>
              <Text style={styles.emptySub}>
                Ingresá a "TV en Vivo" o al reproductor y presioná la estrella ⭐ en tus canales preferidos para verlos aquí.
              </Text>
            </View>
          )
        ) : (
          favMoviesList.length > 0 || favSeriesList.length > 0 ? (
            <View style={styles.vodGrid}>
              {favMoviesList.map((m, idx) => (
                <View key={`${m.id}-${idx}`} style={styles.vodCard}>
                  <TouchableOpacity style={styles.posterArea} onPress={() => handlePlayMovie(m)}>
                    {m.posterUrl ? (
                      <Image source={{ uri: m.posterUrl }} style={styles.posterImg} resizeMode="cover" />
                    ) : (
                      <Text style={styles.posterEmoji}>{m.posterEmoji}</Text>
                    )}
                    <TouchableOpacity
                      style={styles.favBadgeBtn}
                      onPress={() => {
                        toggleFavoriteMovie(m.id);
                        toggleFavoriteMovie(m.title);
                      }}
                    >
                      <Text style={styles.starText}>⭐</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                  <Text style={styles.vodTitle} numberOfLines={1}>{m.title}</Text>
                  <Text style={styles.vodSub}>{m.year} • {m.category}</Text>
                </View>
              ))}

              {favSeriesList.map((s, idx) => (
                <View key={`${s.id}-${idx}`} style={styles.vodCard}>
                  <TouchableOpacity style={styles.posterArea} onPress={() => handlePlaySeries(s)}>
                    {(s as any).posterUrl ? (
                      <Image source={{ uri: (s as any).posterUrl }} style={styles.posterImg} resizeMode="cover" />
                    ) : (
                      <Text style={styles.posterEmoji}>{s.posterEmoji}</Text>
                    )}
                    <TouchableOpacity
                      style={styles.favBadgeBtn}
                      onPress={() => {
                        toggleFavoriteMovie(s.id);
                        toggleFavoriteMovie(s.title);
                      }}
                    >
                      <Text style={styles.starText}>⭐</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                  <Text style={styles.vodTitle} numberOfLines={1}>{s.title}</Text>
                  <Text style={styles.vodSub}>{s.seasonsCount} Temp • Serie</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🎬</Text>
              <Text style={styles.emptyTitle}>No tenés películas ni series guardadas</Text>
              <Text style={styles.emptySub}>
                Tocá la estrella ⭐ en la ficha de cualquier película, serie o en el reproductor para tenerla siempre a mano.
              </Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Reproductor de Video */}
      {activeStreamUrl && (
        <VideoPlayerModal
          visible={activeStreamUrl !== null}
          streamUrl={activeStreamUrl}
          title={activeStreamTitle}
          onClose={() => setActiveStreamUrl(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  screenTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  clearIcon: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  tabBtnActive: {
    backgroundColor: COLORS.electricBlue,
    borderColor: COLORS.electricBlue,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentGrid: {
    padding: 20,
  },
  channelsGrid: {
    gap: 12,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgSecondary,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  channelInfoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoEmoji: {
    fontSize: 24,
  },
  detailsBox: {
    flex: 1,
  },
  channelName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  categoryBadge: {
    color: COLORS.electricBlue,
    fontSize: 11,
    fontWeight: 'bold',
  },
  hdBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    color: '#00F0FF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  starBtn: {
    padding: 10,
  },
  starText: {
    fontSize: 20,
  },
  vodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  vodCard: {
    width: 140,
    marginBottom: 10,
  },
  posterArea: {
    width: 140,
    height: 200,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  posterImg: {
    width: '100%',
    height: '100%',
  },
  posterEmoji: {
    fontSize: 48,
  },
  favBadgeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14,
    padding: 4,
  },
  vodTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  vodSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 54,
    marginBottom: 14,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptySub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 320,
  },
});
