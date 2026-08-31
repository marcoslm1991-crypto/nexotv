import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, TextInput, useWindowDimensions } from 'react-native';
import { SERIES_CATALOG, Series, SeriesEpisode } from '../services/contentCatalog';
import { FocusableItem } from '../components/FocusableItem';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { useFavorites } from '../context/FavoritesContext';
import { COLORS } from '../theme/colors';

export const SeriesScreen: React.FC = () => {
  const [series, setSeries] = useState<Series[]>(SERIES_CATALOG);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [playingEpisode, setPlayingEpisode] = useState<{ title: string; duration: string; url?: string; emoji?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { isMovieFavorite, toggleFavoriteMovie } = useFavorites();
  const { width } = useWindowDimensions();

  // Fetch Series Feed from NestJS Backend API
  useEffect(() => {
    fetch('https://nexotv-necn.onrender.com/api/v1/vod/series/feed')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const loadedSeries: Series[] = data.map((s: any) => {
            const episodes: SeriesEpisode[] = (s.seasons || []).flatMap((se: any) =>
              (se.episodes || []).map((ep: any) => ({
                id: ep.id,
                season: se.season_number,
                episodeNumber: ep.episode_number,
                title: ep.title,
                duration: ep.duration || '45m',
                synopsis: ep.synopsis || 'Episodio disponible en HD.',
                streamUrl: ep.active_source?.url || ep.stream_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              })),
            );

            return {
              id: s.id,
              title: s.title,
              category: (s.genre || s.category || 'Drama').toUpperCase(),
              year: s.year || 2026,
              seasonsCount: s.seasons_count || (s.seasons ? s.seasons.length : 1),
              episodesCount: s.episodes_count || episodes.length,
              rating: s.rating || 'IMDb 8.1',
              synopsis: s.synopsis || 'Serie completa por temporadas.',
              posterEmoji: s.poster_emoji || '📺',
              posterUrl: s.poster_url,
              episodes: episodes.length > 0 ? episodes : [
                {
                  id: `ep-demo-${s.id}`,
                  season: 1,
                  episodeNumber: 1,
                  title: 'Episodio 1: Piloto',
                  duration: '45m',
                  synopsis: 'Episodio en alta definición.',
                  streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                },
              ],
            };
          });
          setSeries(loadedSeries);
        }
      })
      .catch(() => {});
  }, []);

  const filteredSeries = searchQuery
    ? series.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : series;

  // Responsive grid calculation for series
  const numColumns = width < 480 ? 3 : width < 768 ? 4 : width < 1100 ? 5 : 6;
  const gapSize = 12;
  const computedCardWidth = Math.max(90, Math.floor((width - 48 - gapSize * (numColumns - 1)) / numColumns));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📺 Series & Temporadas ({filteredSeries.length} Series)</Text>
        <Text style={styles.subtitle}>Las mejores producciones originales y episodios en HD</Text>
      </View>

      {/* Buscador 🔍 de Series */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar serie por título..."
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

      <ScrollView contentContainerStyle={styles.gridContainer}>
        <View style={styles.grid}>
          {filteredSeries.map((ser, idx) => {
            const isFav = isMovieFavorite(ser.id);
            return (
              <FocusableItem
                key={ser.id}
                hasTVPreferredFocus={idx === 0}
                style={[styles.seriesCard, { width: computedCardWidth }]}
                focusedStyle={styles.seriesCardFocused}
                onPress={() => setSelectedSeries(ser)}
              >
                <View style={styles.posterBox}>
                  {(ser as any).posterUrl ? (
                    <Image source={{ uri: (ser as any).posterUrl }} style={styles.posterImage} resizeMode="cover" />
                  ) : (
                    <Text style={styles.posterEmoji}>{ser.posterEmoji}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.favBadgeBtn}
                    onPress={() => toggleFavoriteMovie(ser.id)}
                  >
                    <Text style={styles.favStarText}>{isFav ? '⭐' : '☆'}</Text>
                  </TouchableOpacity>

                  <View style={styles.badgeBox}>
                    <Text style={styles.badgeText}>{ser.seasonsCount} Temp</Text>
                  </View>
                </View>
                <Text style={styles.seriesTitle} numberOfLines={1}>{ser.title}</Text>
                <Text style={styles.seriesMeta}>{ser.episodesCount} Episodios • {ser.rating}</Text>
              </FocusableItem>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal de Detalle de Serie y Lista de Episodios */}
      <Modal
        visible={selectedSeries !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedSeries(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.seriesDetailCard}>
            {(selectedSeries as any)?.posterUrl ? (
              <Image source={{ uri: (selectedSeries as any).posterUrl }} style={{ width: 80, height: 110, borderRadius: 8, alignSelf: 'center', marginBottom: 10 }} />
            ) : (
              <Text style={styles.detailEmoji}>{selectedSeries?.posterEmoji}</Text>
            )}
            <Text style={styles.detailTitle}>{selectedSeries?.title}</Text>
            <Text style={styles.detailSynopsis}>{selectedSeries?.synopsis}</Text>

            <Text style={styles.episodesHeader}>Episodios Disponibles ({selectedSeries?.episodes.length}):</Text>

            <ScrollView style={styles.episodesScroll}>
              {selectedSeries?.episodes.map((ep, idx) => (
                <FocusableItem
                  key={`${ep.id}-${idx}`}
                  style={styles.episodeRow}
                  focusedStyle={styles.episodeRowFocused}
                  onPress={() => {
                    setPlayingEpisode({
                      title: `${selectedSeries.title} - ${ep.title}`,
                      duration: ep.duration,
                      url: ep.streamUrl,
                      emoji: selectedSeries.posterEmoji,
                    });
                  }}
                >
                  <Text style={styles.episodeNumber}>Cap. {ep.episodeNumber || idx + 1}</Text>
                  <View style={styles.episodeInfo}>
                    <Text style={styles.episodeTitle}>{ep.title}</Text>
                    <Text style={styles.episodeDuration}>Duración: {ep.duration}</Text>
                  </View>
                  <Text style={styles.playIcon}>▶</Text>
                </FocusableItem>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedSeries(null)}>
              <Text style={styles.closeBtnText}>CERRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reproductor de Video para Episodio Seleccionado */}
      <VideoPlayerModal
        visible={playingEpisode !== null}
        title={playingEpisode?.title || 'Reproduciendo Episodio'}
        subtitle={`Serie HD • ${playingEpisode?.duration || ''}`}
        streamUrl={playingEpisode?.url}
        posterEmoji={playingEpisode?.emoji}
        onClose={() => setPlayingEpisode(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    padding: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.electricBlue,
    fontSize: 12,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
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
  gridContainer: {
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seriesCard: {
    marginBottom: 16,
  },
  seriesCardFocused: {
    transform: [{ scale: 1.05 }],
  },
  posterBox: {
    width: '100%',
    aspectRatio: 0.68,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterEmoji: {
    fontSize: 40,
  },
  favBadgeBtn: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  favStarText: {
    fontSize: 14,
  },
  badgeBox: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 184, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  seriesTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seriesMeta: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  seriesDetailCard: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    backgroundColor: '#0F131C',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1.5,
    borderColor: COLORS.electricBlue,
  },
  detailEmoji: {
    fontSize: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  detailSynopsis: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  episodesHeader: {
    color: COLORS.electricBlue,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  episodesScroll: {
    maxHeight: 220,
    marginBottom: 16,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  episodeRowFocused: {
    backgroundColor: COLORS.neonViolet,
  },
  episodeNumber: {
    color: COLORS.electricBlue,
    fontSize: 12,
    fontWeight: 'bold',
    width: 60,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  episodeDuration: {
    color: '#94A3B8',
    fontSize: 11,
  },
  playIcon: {
    color: '#00F0FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
