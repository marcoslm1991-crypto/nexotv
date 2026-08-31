import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../theme/colors';
import { useFavorites } from '../context/FavoritesContext';

interface VideoPlayerModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  streamUrl?: string;
  posterEmoji?: string;
  contentId?: string;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  visible,
  title,
  subtitle,
  streamUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  posterEmoji = '📺',
  contentId = 'demo-content',
  onClose,
}) => {
  const videoRef = useRef<any>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const heartbeatIntervalRef = useRef<any>(null);

  const { favoriteChannels, favoriteMovies, toggleFavoriteChannel, toggleFavoriteMovie } = useFavorites();
  
  const isFavInPlayer =
    favoriteChannels.includes(contentId || '') ||
    favoriteChannels.includes(title) ||
    favoriteMovies.includes(contentId || '') ||
    favoriteMovies.includes(title);

  const handleToggleFav = () => {
    toggleFavoriteChannel(contentId || title);
    toggleFavoriteChannel(title);
    toggleFavoriteMovie(contentId || title);
    toggleFavoriteMovie(title);
  };

  const isYouTube = streamUrl.includes('youtube.com') || streamUrl.includes('youtu.be');

  // Detectar cambios en el estado de pantalla completa del navegador (Web API)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const handleFSChange = () => {
        const doc = document as any;
        setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
      };
      document.addEventListener('fullscreenchange', handleFSChange);
      document.addEventListener('webkitfullscreenchange', handleFSChange);
      return () => {
        document.removeEventListener('fullscreenchange', handleFSChange);
        document.removeEventListener('webkitfullscreenchange', handleFSChange);
      };
    }
  }, []);

  const toggleFullscreen = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const doc = document as any;
      const elem = videoRef.current || document.documentElement;
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => {
            document.documentElement.requestFullscreen().catch(() => {});
          });
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } else {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Convertir URL de YouTube Live a iframe embed
  const getYouTubeEmbedUrl = (url: string) => {
    let channelOrVideo = '';
    if (url.includes('/c/')) {
      channelOrVideo = url.split('/c/')[1].replace('/live', '');
    } else if (url.includes('/user/')) {
      channelOrVideo = url.split('/user/')[1].replace('/live', '');
    } else if (url.includes('/channel/')) {
      channelOrVideo = url.split('/channel/')[1].replace('/live', '');
    }

    if (channelOrVideo) {
      return `https://www.youtube.com/embed/live_stream?channel=${channelOrVideo}&autoplay=1`;
    }
    return url;
  };

  // Autorización de Pantalla y Heartbeat con Backend NestJS
  useEffect(() => {
    if (!visible) {
      if (activeStreamId) {
        fetch('http://localhost:3000/streams/stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active_stream_id: activeStreamId }),
        }).catch(() => {});
        setActiveStreamId(null);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      setIsAuthorized(false);
      setStreamError(null);
      return;
    }

    const authorizeStream = async () => {
      try {
        const response = await fetch('http://localhost:3000/streams/authorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile_id: 'p1',
            device_uuid: 'web-device-browser-01',
            device_name: 'Navegador Web / Smart TV Client',
            content_id: contentId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStreamError(data.message || 'Límite de pantallas simultáneas alcanzado en tu plan.');
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(true);
        setActiveStreamId(data.active_stream_id);

        heartbeatIntervalRef.current = setInterval(() => {
          if (data.active_stream_id) {
            fetch('http://localhost:3000/streams/heartbeat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ active_stream_id: data.active_stream_id }),
            }).catch(() => {});
          }
        }, 25000);

      } catch (e) {
        setIsAuthorized(true);
      }
    };

    authorizeStream();

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [visible, contentId]);

  // Carga de Video HLS
  useEffect(() => {
    if (Platform.OS === 'web' && visible && isAuthorized && streamUrl && videoRef.current && !isYouTube) {
      if (streamUrl.includes('.m3u8')) {
        const initHls = () => {
          const win = window as any;
          if (win && win.Hls && win.Hls.isSupported()) {
            const hls = new win.Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoRef.current);
          } else if (videoRef.current?.canPlayType?.('application/vnd.apple.mpegurl')) {
            videoRef.current.src = streamUrl;
          }
        };

        const win = window as any;
        if (win && win.Hls) {
          initHls();
        } else if (typeof document !== 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.onload = initHls;
          document.body.appendChild(script);
        }
      } else {
        videoRef.current.src = streamUrl;
      }
    }
  }, [visible, isAuthorized, streamUrl, isYouTube]);

  if (!visible) return null;

  const handleClose = () => {
    if (activeStreamId) {
      fetch('http://localhost:3000/streams/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active_stream_id: activeStreamId }),
      }).catch(() => {});
    }
    onClose();
  };

  const videoHeight = isFullscreen ? (Platform.OS === 'web' ? 'calc(100vh - 110px)' : '100%') : '320px';

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleClose}>
      <View style={[styles.modalOverlay, isFullscreen && styles.modalOverlayFullscreen]}>
        <View style={[styles.playerCard, isFullscreen && styles.playerCardFullscreen]}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.titleBox}>
              <Text style={styles.playerTitle} numberOfLines={1}>{title}</Text>
              {subtitle && <Text style={styles.playerSubtitle}>{subtitle}</Text>}
            </View>

            <View style={styles.headerActions}>
              {/* Botón de Estrella en Header */}
              <TouchableOpacity
                style={[styles.headerFavBtn, isFavInPlayer && styles.headerFavBtnActive]}
                onPress={handleToggleFav}
              >
                <Text style={styles.headerFavStar}>{isFavInPlayer ? '⭐' : '☆'}</Text>
              </TouchableOpacity>

              {/* Botón de Cierre */}
              <TouchableOpacity style={styles.closeBadge} onPress={handleClose}>
                <Text style={styles.closeBadgeText}>✖ CERRAR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Error o Reproductor de Video */}
          {streamError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>🚫</Text>
              <Text style={styles.errorTitle}>REPRODUCCIÓN BLOQUEADA</Text>
              <Text style={styles.errorMessage}>{streamError}</Text>
              <TouchableOpacity style={styles.errorBtn} onPress={handleClose}>
                <Text style={styles.errorBtnText}>ENTENDIDO</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.videoContainer, isFullscreen && styles.videoContainerFullscreen]}>
              {/* Botón Flotante ⭐ Sobre el Video (Visible en Vertical y en Pantalla Completa Horizontal) */}
              <TouchableOpacity
                style={[styles.floatingStarOverlay, isFavInPlayer && styles.floatingStarOverlayActive]}
                onPress={handleToggleFav}
              >
                <Text style={styles.floatingStarIcon}>{isFavInPlayer ? '⭐' : '☆'}</Text>
              </TouchableOpacity>

              {Platform.OS === 'web' ? (
                isYouTube ? (
                  <iframe
                    src={getYouTubeEmbedUrl(streamUrl)}
                    style={{
                      width: '100%',
                      height: videoHeight,
                      borderRadius: isFullscreen ? '0px' : '12px',
                      border: 'none',
                      backgroundColor: '#000',
                    } as any}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    controls
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: videoHeight,
                      borderRadius: isFullscreen ? '0px' : '12px',
                      backgroundColor: '#000',
                      objectFit: 'contain',
                      boxShadow: isFullscreen ? 'none' : '0 0 24px rgba(0, 184, 255, 0.4)',
                    } as any}
                  />
                )
              ) : (
                <View style={[styles.nativeVideoPlaceholder, isFullscreen && { height: '100%', flex: 1 }]}>
                  <Text style={styles.videoEmoji}>{posterEmoji}</Text>
                  <Text style={styles.videoStatusText}>▶ Transmitiendo señal en vivo HD</Text>
                </View>
              )}
            </View>
          )}

          {/* Footer de Controles Compacto (Sin desbordamientos) */}
          <View style={styles.controlsFooter}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN VIVO HD 1080p</Text>
            </View>

            <TouchableOpacity style={styles.fullscreenBtn} onPress={toggleFullscreen}>
              <Text style={styles.fullscreenIcon}>⛶</Text>
              <Text style={styles.fullscreenText}>
                {isFullscreen ? 'Salir' : 'Pantalla Completa'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 11, 20, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayFullscreen: {
    backgroundColor: '#000000',
    padding: 0,
  },
  playerCard: {
    width: '94%',
    maxWidth: 720,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.electricBlue,
    shadowColor: COLORS.neonViolet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
  },
  playerCardFullscreen: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 0,
    padding: 8,
    borderWidth: 0,
    justifyContent: 'space-between',
    backgroundColor: '#000000',
  },
  videoContainerFullscreen: {
    flex: 1,
    height: '100%',
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleBox: {
    flex: 1,
    marginRight: 10,
  },
  playerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerSubtitle: {
    color: COLORS.electricBlue,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerFavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerFavBtnActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderColor: '#FFD700',
  },
  headerFavStar: {
    fontSize: 20,
    marginTop: -2,
  },
  closeBadge: {
    backgroundColor: COLORS.neonViolet,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeBadgeText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 11,
  },
  videoContainer: {
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
    position: 'relative',
  },
  floatingStarOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 999,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingStarOverlayActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.85)',
    borderColor: '#FFD700',
  },
  floatingStarIcon: {
    fontSize: 24,
  },
  errorContainer: {
    height: 280,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E50914',
    marginBottom: 12,
  },
  errorIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  errorTitle: {
    color: '#FF4D4D',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  errorMessage: {
    color: COLORS.textPrimary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
    maxWidth: 480,
  },
  errorBtn: {
    backgroundColor: COLORS.electricBlue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorBtnText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  nativeVideoPlaceholder: {
    width: '100%',
    height: 280,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  videoEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoStatusText: {
    color: COLORS.electricBlue,
    fontWeight: 'bold',
    fontSize: 13,
  },
  controlsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00F0FF',
    marginRight: 6,
  },
  liveText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 11,
  },
  fullscreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: '#00F0FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  fullscreenIcon: {
    color: '#00F0FF',
    fontSize: 14,
    fontWeight: '900',
  },
  fullscreenText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
