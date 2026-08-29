import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, useWindowDimensions } from 'react-native';
import { SERIES_CATALOG, Series, SeriesEpisode } from '../services/contentCatalog';
import { FocusableItem } from '../components/FocusableItem';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { COLORS } from '../theme/colors';

export const SeriesScreen: React.FC = () => {
  const [series, setSeries] = useState<Series[]>(SERIES_CATALOG);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [playingEpisode, setPlayingEpisode] = useState<{ title: string; duration: string; url?: string; emoji?: string } | null>(null);

  const { width } = useWindowDimensions();

  // Fetch Series Feed from NestJS Backend API
  useEffect(() => {
    fetch('http://localhost:3000/api/v1/vod/series/feed')
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

  const numColumns = width < 480 ? 2 : width < 768 ? 3 : width < 1100 ? 4 : 5;
  const gapSize = 14;
  const computedCardWidth = Math.max(140, Math.floor((width - 48 - (gapSize * (numColumns - 1))) / numColumns));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📺 Series VOD & Maratón ({series.length} Series)</Text>
        <Text style={styles.subtitle}>Las mejores producciones por temporadas completas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        <View style={styles.grid}>
          {series.map((ser, idx) => (
            <FocusableItem
              key={ser.id}
              hasTVPreferredFocus={idx === 0}
              style={[styles.seriesCard, { width: computedCardWidth }]}
              focusedStyle={styles.seriesCardFocused}
              onPress={() => setSelectedSeries(ser)}
            >
              <View style={styles.posterBox}>
                {ser.posterUrl ? (
                  <Image source={{ uri: ser.posterUrl }} style={styles.posterImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.posterEmoji}>{ser.posterEmoji}</Text>
                )}
                <View style={styles.badgeBox}>
                  <Text style={styles.badgeText}>{ser.seasonsCount} Temp</Text>
                </View>
              </View>
              <Text style={styles.seriesTitle} numberOfLines={1}>{ser.title}</Text>
              <Text style={styles.seriesMeta}>{ser.episodesCount} Episodios • {ser.rating}</Text>
            </FocusableItem>
          ))}
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
            {selectedSeries?.posterUrl ? (
              <Image source={{ uri: selectedSeries.posterUrl }} style={{ width: 80, height: 110, borderRadius: 8, alignSelf: 'center', marginBottom: 10 }} />
            ) : (
              <Text style={styles.detailEmoji}>{selectedSeries?.posterEmoji}</Text>
            )}
            <Text style={styles.detailTitle}>{selectedSeries?.title}</Text>
            <Text style={styles.detailSynopsis}>{selectedSeries?.synopsis}</Text>

            <Text style={styles.episodesHeader}>Episodios Disponibles ({selectedSeries?.episodes.length}):</Text>

            <ScrollView style={styles.episodeList}>
              {selectedSeries?.episodes.map((ep) => (
                <TouchableOpacity
                  key={ep.id}
                  style={styles.episodeRow}
                  onPress={() => {
                    setPlayingEpisode({
                      title: `${selectedSeries.title} - ${ep.title}`,
                      duration: ep.duration,
                      url: (ep as any).streamUrl,
                      emoji: selectedSeries.posterEmoji,
                    });
                  }}
                >
                  <View style={styles.playIconBox}><Text style={styles.playIconText}>▶</Text></View>
                  <View style={styles.epInfo}>
                    <Text style={styles.epTitle}>{ep.title}</Text>
                    <Text style={styles.epSynopsis}>{ep.synopsis}</Text>
                  </View>
                  <Text style={styles.epDuration}>{ep.duration}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedSeries(null)}>
              <Text style={styles.closeText}>VOLVER A SERIES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Reproducción de Video de Episodio */}
      <VideoPlayerModal
        visible={playingEpisode !== null}
        title={playingEpisode?.title || 'Episodio'}
        subtitle={`Duración: ${playingEpisode?.duration || '45m'}`}
        streamUrl={playingEpisode?.url}
        posterEmoji={playingEpisode?.emoji || '📺'}
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
    marginBottom: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  gridContainer: {
    paddingBottom: 60,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  seriesCard: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
  },
  seriesCardFocused: {
    borderColor: COLORS.electricBlue,
    backgroundColor: COLORS.cardBgHover,
    transform: [{ scale: 1.03 }],
  },
  posterBox: {
    height: 140,
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterEmoji: {
    fontSize: 48,
  },
  badgeBox: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.neonViolet,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  seriesTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  seriesMeta: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 11, 20, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seriesDetailCard: {
    width: '90%',
    maxWidth: 580,
    maxHeight: '85%',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: COLORS.electricBlue,
  },
  detailEmoji: {
    fontSize: 46,
    textAlign: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  detailSynopsis: {
    color: COLORS.textSecondary,
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
  episodeList: {
    maxHeight: 220,
    marginBottom: 16,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  playIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.electricBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playIconText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  epInfo: {
    flex: 1,
  },
  epTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  epSynopsis: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  epDuration: {
    color: COLORS.neonViolet,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeBtn: {
    backgroundColor: COLORS.neonViolet,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
