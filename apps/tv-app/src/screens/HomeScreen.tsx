import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../theme/colors';
import { FocusableItem } from '../components/FocusableItem';
import { VideoPlayerModal } from '../components/VideoPlayerModal';

interface ContentItem {
  id: string;
  title: string;
  category: string;
  posterEmoji: string;
  rating?: string;
  match?: string;
  progress?: number;
  remaining?: string;
  streamUrl?: string;
  bgGradient?: string;
}

interface HomeScreenProps {
  onNavigateLive?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [playingItem, setPlayingItem] = useState<ContentItem | null>(null);
  const { width, height } = useWindowDimensions();
  const isMobile = Math.min(width, height) < 768;

  const heroMovie: ContentItem = {
    id: 'hero-1',
    title: 'E ÚLTIMO HORIZONTE',
    category: 'Película Destacada • 2026 • 2h 15m • 4K',
    posterEmoji: '👨‍🚀',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  const tendencias: ContentItem[] = [
    { id: 't1', title: 'DUNA PARTE DOS', category: 'Sci-Fi 4K', rating: '5.7', posterEmoji: '🏜️', bgGradient: '#3B1F0E' },
    { id: 't2', title: 'JOHN WICK 4', category: 'Acción', rating: '5.5', posterEmoji: '🕶️', bgGradient: '#1E293B' },
    { id: 't3', title: 'STRANGER THINGS', category: 'Temporada 5', rating: '6.6', posterEmoji: '🚲', bgGradient: '#450A0A' },
    { id: 't4', title: 'THE FLASH', category: 'Acción / DC', rating: '5.3', posterEmoji: '⚡', bgGradient: '#312E81' },
    { id: 't5', title: 'GODZILLA Y KONG', category: 'Aventura', rating: '8.2', posterEmoji: '🦖', bgGradient: '#064E3B' },
  ];

  const nexoAiRecomendados: ContentItem[] = [
    { id: 'ai1', title: 'INTERESTELAR', category: 'Ciencia Ficción', match: '63% MATCH', posterEmoji: '🚀', bgGradient: '#0F172A' },
    { id: 'ai2', title: 'BLADE RUNNER 2019', category: 'Cyberpunk', match: '69% MATCH', posterEmoji: '🌆', bgGradient: '#1E1B4B' },
    { id: 'ai3', title: 'EL JUEGO DEL CALAMAR', category: 'Drama', match: '63% MATCH', posterEmoji: '🦑', bgGradient: '#881337' },
    { id: 'ai4', title: 'THE MANDALORIAN', category: 'Sci-Fi', match: '75% MATCH', posterEmoji: '🌌', bgGradient: '#172554' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, isMobile && styles.mobilePadding]}>
      {/* Banner Héroe Película Destacada - Estilo Imagen 1 */}
      <View style={[styles.heroBanner, isMobile && styles.mobileHeroBanner]}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTag}>PELÍCULA DESTACADA</Text>
          <Text style={[styles.heroTitle, isMobile && styles.mobileHeroTitle]}>{heroMovie.title}</Text>
          <Text style={styles.heroSynopsis} numberOfLines={isMobile ? 3 : 4}>
            En un futuro donde la humanidad busca un nuevo hogar en el espacio, un secreto cambiará todo lo que conocen.
          </Text>

          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => setPlayingItem(heroMovie)}
            >
              <Text style={styles.playBtnText}>▶  VER AHORA</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.myListBtn} onPress={() => alert('Agregado a Mi Lista')}>
              <Text style={styles.myListText}>+  MI LISTA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Indicadores Carusel (Puntos estilo Imagen 1) */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Sección 1: 🔥 Tendencias */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Tendencias</Text>
        <TouchableOpacity><Text style={styles.seeAllText}>Ver todo</Text></TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalRow}>
        {tendencias.map((item, idx) => (
          <FocusableItem
            key={item.id}
            hasTVPreferredFocus={idx === 0}
            style={styles.posterCard}
            onPress={() => setPlayingItem(item)}
          >
            <View style={[styles.posterGraphic, { backgroundColor: item.bgGradient || COLORS.cardBg }]}>
              <Text style={styles.posterEmoji}>{item.posterEmoji}</Text>
              <Text style={styles.posterTitleText}>{item.title}</Text>
              {item.rating && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {item.rating}</Text>
                </View>
              )}
            </View>
          </FocusableItem>
        ))}
      </ScrollView>

      {/* Sección 2: ✨ NexoAI recomendó para vos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.aiSectionTitle}>✨ NexoAI recomendó para vos</Text>
        <TouchableOpacity><Text style={styles.seeAllTextAi}>Ver todo</Text></TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalRow}>
        {nexoAiRecomendados.map((item) => (
          <FocusableItem
            key={item.id}
            style={styles.posterCard}
            onPress={() => setPlayingItem(item)}
          >
            <View style={[styles.posterGraphic, { backgroundColor: item.bgGradient || COLORS.cardBg }]}>
              <Text style={styles.posterEmoji}>{item.posterEmoji}</Text>
              <Text style={styles.posterTitleText}>{item.title}</Text>
              {item.match && (
                <View style={styles.matchContainer}>
                  <Text style={styles.matchText}>{item.match}</Text>
                  <View style={styles.matchBarBg}>
                    <View style={styles.matchBarFill} />
                  </View>
                </View>
              )}
            </View>
          </FocusableItem>
        ))}
      </ScrollView>

      {/* Reproductor de Video Modal */}
      <VideoPlayerModal
        visible={playingItem !== null}
        title={playingItem?.title || 'Película Destacada'}
        subtitle={playingItem?.category}
        streamUrl={playingItem?.streamUrl}
        posterEmoji={playingItem?.posterEmoji}
        onClose={() => setPlayingItem(null)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  mobilePadding: {
    padding: 14,
    paddingBottom: 70,
  },
  heroBanner: {
    height: 250,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 20,
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 255, 0.2)',
  },
  mobileHeroBanner: {
    height: 230,
    padding: 16,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTag: {
    color: COLORS.electricBlue,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  mobileHeroTitle: {
    fontSize: 22,
  },
  heroSynopsis: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 16,
    maxWidth: 400,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
  playBtn: {
    backgroundColor: COLORS.neonViolet,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.intenseViolet,
  },
  playBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  myListBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  myListText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
  },
  dotActive: {
    width: 18,
    backgroundColor: COLORS.neonViolet,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: COLORS.neonViolet,
    fontSize: 12,
    fontWeight: '600',
  },
  aiSectionTitle: {
    color: COLORS.electricBlue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAllTextAi: {
    color: COLORS.electricBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  posterCard: {
    width: 125,
    marginRight: 12,
  },
  posterGraphic: {
    height: 180,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  posterEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },
  posterTitleText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: COLORS.neonViolet,
    fontSize: 10,
    fontWeight: 'bold',
  },
  matchContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  matchText: {
    color: COLORS.electricBlue,
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 3,
  },
  matchBarBg: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  matchBarFill: {
    height: '100%',
    width: '65%',
    backgroundColor: COLORS.electricBlue,
  },
});
