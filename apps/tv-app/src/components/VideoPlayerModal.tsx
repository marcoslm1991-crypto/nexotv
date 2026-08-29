import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../theme/colors';

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

  // 1. Autorización de Pantalla y Heartbeat con Backend NestJS (Puerto 3000)
  useEffect(() => {
    if (!visible) {
      // Liberar sesión al cerrar
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

    // Solicitar autorización de pantalla al backend
    const authorizeStream = async () => {
      try {
        const response = await fetch('http://localhost:3000/streams/authorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile_id: 'p1', // Perfil actual
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

        // Iniciar pulso heartbeat cada 25 segundos
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
        // En caso de que el backend no responda, autorizar modo fallback para prototipo
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

  // 2. Carga de Video HLS / HTML5 (Solo en Web)
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

  const videoHeight = isFullscreen ? (Platform.OS === 'web' ? 'calc(100vh - 110px)' : '100%') : '340px';

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleClose}>
      <View style={[styles.modalOverlay, isFullscreen && styles.modalOverlayFullscreen]}>
        <View style={[styles.playerCard, isFullscreen && styles.playerCardFullscreen]}>
          <View style={styles.headerRow}>
            <View style={styles.titleBox}>
              <Text style={styles.playerTitle} numberOfLines={1}>{title}</Text>
              {subtitle && <Text style={styles.playerSubtitle}>{subtitle}</Text>}
            </View>
            <TouchableOpacity style={styles.closeBadge} onPress={handleClose}>
              <Text style={styles.closeBadgeText}>✖ CERRAR TRANSMISIÓN</Text>
            </TouchableOpacity>
          </View>

          {/* Si se superó el límite de pantallas o la suscripción venció */}
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
                  <Text style={styles.videoStatusText}>▶ Transmitiendo señal en vivo desde servidor HLS</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.controlsFooter}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>TRANSMISIÓN EN DIRECTO FULL HD 1080p</Text>
            </View>
            <TouchableOpacity style={styles.fullscreenBtn} onPress={toggleFullscreen}>
              <Text style={styles.fullscreenIcon}>⛶</Text>
              <Text style={styles.fullscreenText}>
                {isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
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
    width: '90%',
    maxWidth: 720,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 18,
    padding: 24,
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
    padding: 12,
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
    marginBottom: 16,
  },
  titleBox: {
    flex: 1,
    marginRight: 12,
  },
  playerTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerSubtitle: {
    color: COLORS.electricBlue,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  closeBadge: {
    backgroundColor: COLORS.neonViolet,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeBadgeText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  videoContainer: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  errorContainer: {
    height: 320,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: '#E50914',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  errorTitle: {
    color: '#FF4D4D',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10,
  },
  errorMessage: {
    color: COLORS.textPrimary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    maxWidth: 520,
  },
  errorBtn: {
    backgroundColor: COLORS.electricBlue,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorBtnText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  nativeVideoPlaceholder: {
    width: '100%',
    height: 320,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  videoEmoji: {
    fontSize: 54,
    marginBottom: 10,
  },
  videoStatusText: {
    color: COLORS.electricBlue,
    fontWeight: 'bold',
    fontSize: 14,
  },
  controlsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 12,
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
    marginRight: 8,
  },
  liveText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  fullscreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: '#00F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  fullscreenIcon: {
    color: '#00F0FF',
    fontSize: 16,
    fontWeight: '900',
  },
  fullscreenText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
