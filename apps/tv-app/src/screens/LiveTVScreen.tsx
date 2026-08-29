import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { CHANNELS_CATALOG, Channel } from '../services/contentCatalog';
import { FocusableItem } from '../components/FocusableItem';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { COLORS } from '../theme/colors';

export const LiveTVScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [channels, setChannels] = useState<Channel[]>(CHANNELS_CATALOG);
  const [playingChannel, setPlayingChannel] = useState<Channel | null>(null);

  const { width, height } = useWindowDimensions();
  const isMobile = Math.min(width, height) < 768;

  // Cargar canales y categorías en tiempo real desde el backend NestJS
  useEffect(() => {
    fetch('http://localhost:3000/api/v1/tv/live')
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
        // Fallback endpoint
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

  const filteredChannels = selectedCategory === 'TODOS'
    ? channels
    : channels.filter((ch) => ch.category.toUpperCase().includes(selectedCategory.toUpperCase()));

  // Cálculo dinámico responsive para aprovechar el 100% del ancho de la pantalla y eliminar espacio vacío a la derecha
  const numColumns = width < 480 ? 4 : width < 768 ? 5 : width < 1100 ? 6 : 8;
  const horizontalPadding = isMobile ? 24 : 32;
  const gapSize = 10;
  const computedCardWidth = Math.max(70, Math.floor((width - horizontalPadding - (gapSize * (numColumns - 1))) / numColumns));

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

          <View style={styles.topHeaderRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => alert('Actualizando lista de canales...')}>
              <Text style={styles.iconBtnText}>🔄</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reproductor Vista Previa Superior */}
        {playingChannel ? (
          <View style={styles.previewActiveBox}>
            <Text style={styles.previewActiveTitle}>▶ Reproduciendo: {playingChannel.name}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.playerPreviewBox}
            onPress={() => channels.length > 0 && setPlayingChannel(channels[0])}
          >
            <Text style={styles.playerPreviewIcon}>▶</Text>
            <Text style={styles.playerPreviewTitle}>Toca un canal para reproducir en Vivo</Text>
          </TouchableOpacity>
        )}

        {/* Categorías Principales Chips */}
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
          {selectedCategory === 'TODOS' ? 'Todos los Canales en Vivo' : `Categoría: ${selectedCategory}`}
        </Text>

        {/* Grilla Deslizable de Canales de TV (Aprovechando 100% Ancho) */}
        <View style={styles.channelGrid}>
          {filteredChannels.map((ch, idx) => (
            <FocusableItem
              key={`${ch.id}-${idx}`}
              hasTVPreferredFocus={idx === 0}
              style={[styles.gridChannelCard, { width: computedCardWidth }]}
              onPress={() => setPlayingChannel(ch)}
            >
              <View style={styles.channelBadgeBox}>
                {ch.logoUrl ? (
                  <Image source={{ uri: ch.logoUrl }} style={styles.channelLogoImg} resizeMode="contain" />
                ) : (
                  <Text style={styles.channelEmojiText}>{ch.logoEmoji}</Text>
                )}
                {ch.isHD && <View style={styles.hdBadge}><Text style={styles.hdText}>HD</Text></View>}
              </View>
              <Text style={styles.channelCardName} numberOfLines={2}>{ch.name}</Text>
            </FocusableItem>
          ))}
        </View>
      </ScrollView>

      {/* Reproductor de Video Modal */}
      <VideoPlayerModal
        visible={playingChannel !== null}
        title={playingChannel?.name || 'Canal en Vivo'}
        subtitle={`En Vivo: ${playingChannel?.nowPlaying || ''}`}
        streamUrl={playingChannel?.streamUrl}
        posterEmoji={playingChannel?.logoEmoji}
        contentId={playingChannel?.id}
        onClose={() => setPlayingChannel(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F131C',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 150,
  },
  mobileContentContainer: {
    padding: 12,
    paddingBottom: 160,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topHeaderLeft: {
    flexDirection: 'column',
  },
  appNameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  expirationText: {
    color: COLORS.electricBlue,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  topHeaderRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
  iconBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  previewActiveBox: {
    backgroundColor: 'rgba(0, 184, 255, 0.15)',
    borderColor: COLORS.electricBlue,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  previewActiveTitle: {
    color: COLORS.electricBlue,
    fontWeight: 'bold',
    fontSize: 13,
  },
  playerPreviewBox: {
    height: 100,
    backgroundColor: '#05070A',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  playerPreviewIcon: {
    fontSize: 24,
    color: COLORS.neonViolet,
    marginBottom: 4,
  },
  playerPreviewTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  categoriesScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
    backgroundColor: '#1E293B',
  },
  categoryChipActive: {
    borderColor: COLORS.neonViolet,
    backgroundColor: COLORS.neonViolet,
  },
  categoryChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionCategoryTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
    width: '100%',
  },
  gridChannelCard: {
    alignItems: 'center',
    marginBottom: 14,
  },
  channelBadgeBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  channelLogoImg: {
    width: '85%',
    height: '85%',
  },
  channelEmojiText: {
    fontSize: 28,
  },
  hdBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 184, 255, 0.85)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  hdText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  channelCardName: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
