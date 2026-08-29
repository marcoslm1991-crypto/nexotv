import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { MOVIES_CATALOG, Movie } from '../services/contentCatalog';
import { FocusableItem } from '../components/FocusableItem';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { MediaDetailModal } from '../components/MediaDetailModal';
import { COLORS } from '../theme/colors';

export const MoviesScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [movies, setMovies] = useState<Movie[]>(MOVIES_CATALOG);
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);

  const { width } = useWindowDimensions();

  // Cargar catálogo de películas dinámicamente desde el backend NestJS
  useEffect(() => {
    fetch('http://localhost:3000/api/v1/vod/movies/feed')
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
          setMovies(loadedMovies);
        }
      })
      .catch(() => {});
  }, []);

  const dynamicCategories = ['TODOS', ...Array.from(new Set(movies.map((m) => m.category)))];

  const filteredMovies = selectedCategory === 'TODOS'
    ? movies
    : movies.filter((m) => m.category === selectedCategory);

  // Responsive grid calculation for movies
  const numColumns = width < 480 ? 3 : width < 768 ? 4 : width < 1100 ? 5 : 6;
  const gapSize = 12;
  const computedCardWidth = Math.max(90, Math.floor((width - 48 - (gapSize * (numColumns - 1))) / numColumns));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 Películas VOD 4K ({movies.length} Películas Sincronizadas)</Text>
        <Text style={styles.subtitle}>Catálogo exclusivo de cine en Ultra Alta Definición</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {dynamicCategories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        <View style={styles.grid}>
          {filteredMovies.map((m, idx) => (
            <FocusableItem
              key={m.id}
              hasTVPreferredFocus={idx === 0}
              style={[styles.movieCard, { width: computedCardWidth }]}
              focusedStyle={styles.movieCardFocused}
              onPress={() => setDetailMovie(m)}
            >
              <View style={styles.posterBox}>
                {m.posterUrl ? (
                  <Image source={{ uri: m.posterUrl }} style={styles.posterImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.posterEmoji}>{m.posterEmoji}</Text>
                )}
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{m.rating}</Text>
                </View>
              </View>
              <Text style={styles.movieTitle} numberOfLines={1}>{m.title}</Text>
              <Text style={styles.movieMeta}>{m.year} • {m.duration}</Text>
            </FocusableItem>
          ))}
        </View>
      </ScrollView>

      {/* Pantalla de Detalles Cinematográfica */}
      <MediaDetailModal
        visible={detailMovie !== null}
        item={detailMovie}
        onClose={() => setDetailMovie(null)}
        onPlay={() => {
          setPlayingMovie(detailMovie);
          setDetailMovie(null);
        }}
      />

      {/* Reproductor de Películas 4K */}
      <VideoPlayerModal
        visible={playingMovie !== null}
        title={playingMovie?.title || 'Película 4K'}
        subtitle={`${playingMovie?.year || ''} • ${playingMovie?.duration || ''} • ${playingMovie?.rating || ''}`}
        streamUrl={playingMovie?.streamUrl}
        posterEmoji={playingMovie?.posterEmoji}
        onClose={() => setPlayingMovie(null)}
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.electricBlue,
    fontSize: 12,
    marginTop: 4,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 16,
    maxHeight: 40,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryPillActive: {
    backgroundColor: COLORS.neonViolet,
    borderColor: COLORS.neonViolet,
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
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
  movieCard: {
    marginBottom: 16,
  },
  movieCardFocused: {
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
  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: 'bold',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  movieMeta: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
});
