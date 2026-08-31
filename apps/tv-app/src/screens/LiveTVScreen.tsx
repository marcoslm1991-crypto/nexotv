import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, useWindowDimensions } from 'react-native';
import { CHANNELS_CATALOG, Channel } from '../services/contentCatalog';
import { FocusableItem } from '../components/FocusableItem';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { useFavorites } from '../context/FavoritesContext';
import { COLORS } from '../theme/colors';

export const LiveTVScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [channels, setChannels] = useState<Channel[]>(CHANNELS_CATALOG);
  const [playingChannel, setPlayingChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { isChannelFavorite, toggleFavoriteChannel } = useFavorites();
  const { width, height } = useWindowDimensions();
  const isMobile = Math.min(width, height) < 768;

  // Cargar canales y categorías en tiempo real desde el backend NestJS
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
            setChannels(loadedChannels);
          }
        }
      })
      .catch(() => {
        fetch('http://localhost:3000/api/v1/content/channels')
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              const dbChannels: Channel[] = data.map((ch: any) => ({
                id: ch.id,
                name: ch.name,
                category: ch.category || ch.category_name || 'General',
                number: ch.number || 1,
                logoUrl: ch.logo_url,
                logoEmoji: ch.logo_emoji || '📺',
                nowPlaying: ch.now_playing || 'Transmisión en Vivo HD',
                streamUrl: ch.stream_url || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                isHD: ch.is_hd ?? true,
              }));
              setChannels(dbChannels);
            }
          })
          .catch(() => {});
      });
  }, []);

  // Categorías dinámicas
  const dynamicCategories = [
    'TODOS',
    ...Array.from(new Set(channels.map((ch) => (ch.category || 'GENERAL').toUpperCase()))),
  ];

  // Filtrado por categoría y buscador en tiempo real
  const filteredChannels = channels
    .filter((ch) => (selectedCategory === 'TODOS' ? true : ch.category.toUpperCase().includes(selectedCategory.toUpperCase())))
    .filter((ch) => (searchQuery ? ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || ch.category.toLowerCase().includes(searchQuery.toLowerCase()) : true));

  // Cálculo dinámico responsive
  const numColumns = width < 480 ? 4 : width < 768 ? 5 : width < 1100 ? 6 : 8;
  const horizontalPadding = isMobile ? 24 : 32;
  const gapSize = 10;
  const computedCardWidth = Math.max(70, Math.floor((width - horizontalPadding - gapSize * (numColumns - 1)) / numColumns));

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.contentContainer, isMobile && styles.mobileContentContainer]}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {/* Header IPTV */}
        <View style={styles.topHeader}>
          <View style={styles.topHeaderLeft}>
            <Text style={styles.appNameText}>🔴 TV en Vivo ({filteredChannels.length} Canales)</Text>
            <Text style={styles.expirationText}>Suscripción Activa • Guía EPG HD</Text>
          </View>
        </View>

        {/* Buscador 🔍 en Tiempo Real para Canales */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar canal por nombre (ej: TN, TyC, Fox, ESPN, Telefe...)"
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

        {/* Categorías Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {dynamicCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                {selectedCategory === cat ? `✓ ${cat}` : cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionCategoryTitle}>
          {searchQuery ? `Resultados para "${searchQuery}":` : selectedCategory === 'TODOS' ? 'Todos los Canales en Vivo' : `Categoría: ${selectedCategory}`}
        </Text>

        {/* Grilla de Canales con botón de Favoritos ⭐ */}
        <View style={styles.channelGrid}>
          {filteredChannels.map((ch, idx) => {
            const isFav = isChannelFavorite(ch.id) || isChannelFavorite(ch.name);
            return (
              <FocusableItem
                key={`${ch.id}-${idx}`}
                hasTVPreferredFocus={idx === 0}
                style={[styles.gridChannelCard, { width: computedCardWidth }]}
                onPress={() => setPlayingChannel(ch)}
              >
                <TouchableOpacity
                  style={styles.favBadgeBtn}
                  onPress={() => {
                    toggleFavoriteChannel(ch.id);
                    toggleFavoriteChannel(ch.name);
                  }}
                >
                  <Text style={styles.favBadgeStar}>{isFav ? '⭐' : '☆'}</Text>
                </TouchableOpacity>

                <View style={styles.channelBadgeBox}>
                  {ch.logoUrl ? (
                    <Image source={{ uri: ch.logoUrl }} style={styles.gridChannelLogo} resizeMode="contain" />
                  ) : (
                    <Text style={styles.gridChannelEmoji}>{ch.logoEmoji}</Text>
                  )}
                </View>
                <Text style={styles.gridChannelName} numberOfLines={1}>{ch.name}</Text>
              </FocusableItem>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Reproductor HLS/MP4 */}
      {playingChannel && (
        <VideoPlayerModal
          visible={playingChannel !== null}
          streamUrl={playingChannel.streamUrl}
          title={playingChannel.name}
          contentId={playingChannel.id}
          posterEmoji={playingChannel.logoEmoji}
          onClose={() => setPlayingChannel(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  mobileContentContainer: {
    padding: 12,
    paddingBottom: 90,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topHeaderLeft: {
    flex: 1,
  },
  appNameText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  expirationText: {
    color: COLORS.textSecondary,
    fontSize: 12,
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
  categoriesScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  categoryChipActive: {
    backgroundColor: COLORS.electricBlue,
    borderColor: COLORS.electricBlue,
  },
  categoryChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  sectionCategoryTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridChannelCard: {
    height: 100,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    position: 'relative',
  },
  favBadgeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 10,
    padding: 2,
  },
  favBadgeStar: {
    fontSize: 16,
  },
  channelBadgeBox: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridChannelLogo: {
    width: 42,
    height: 42,
  },
  gridChannelEmoji: {
    fontSize: 28,
  },
  gridChannelName: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
