import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { FocusableItem } from '../components/FocusableItem';
import { ZappingOverlay, ChannelItem } from '../components/ZappingOverlay';

interface PlayerScreenProps {
  title: string;
  isLive?: boolean;
  savedProgressSeconds?: number;
  onClosePlayer: () => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  title,
  isLive = false,
  savedProgressSeconds = 0,
  onClosePlayer,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(savedProgressSeconds > 0 ? savedProgressSeconds : 0);
  const durationTime = 7200; // 2 horas (7200s) para prueba VOD
  const [quality, setQuality] = useState('Auto (1080p)');
  const [audioTrack, setAudioTrack] = useState('Español Latino');
  const [subtitleTrack, setSubtitleTrack] = useState('Desactivado');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [showResumeModal, setShowResumeModal] = useState(savedProgressSeconds > 0);
  const [showZapping, setShowZapping] = useState(false);

  const toggleFullscreen = () => {
    if (typeof document !== 'undefined') {
      const doc = document as any;
      if (!doc.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    } else {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Simulación de paso de tiempo en reproducción VOD
  useEffect(() => {
    let timer: any;
    if (isPlaying && !showResumeModal) {
      timer = setInterval(() => {
        setCurrentTime((prev) => (prev >= durationTime ? durationTime : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, showResumeModal]);

  const mockChannels: ChannelItem[] = [
    { id: 'ch-1', number: 1, name: 'Deportes HD', category: 'Deportes', epgTitle: 'Real Madrid vs Barcelona', epgTime: '14:00 - 16:00' },
    { id: 'ch-2', number: 2, name: 'Canal 13 Argentina', category: 'Canales Argentina', epgTitle: 'Noticiero Trece', epgTime: '13:00 - 14:30' },
    { id: 'ch-3', number: 3, name: 'Cine Premium', category: 'Películas', epgTitle: 'Misión Imposible', epgTime: '15:00 - 17:40' },
  ];

  const [currentChannel, setCurrentChannel] = useState(mockChannels[0]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isNextEpisodeThreshold = durationTime - currentTime <= 30 && durationTime - currentTime > 0;

  return (
    <View style={styles.container}>
      {/* Visual de Video Stream (Simulado/ExoPlayer Canvas) */}
      <View style={styles.videoCanvas}>
        <Text style={styles.videoCanvasEmoji}>{isLive ? '🔴 TRANSMISIÓN EN DIRECTO HLS' : '🎬 STREAMING VOD'}</Text>
        <Text style={styles.videoCanvasTitle}>{isLive ? currentChannel.name : title}</Text>
      </View>

      {/* Modal de Reanudar Reproducción (Sección 14) */}
      {showResumeModal && (
        <Modal transparent animationType="fade" visible={showResumeModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Reanudar Reproducción</Text>
              <Text style={styles.modalSub}>
                ¿Deseás reanudar desde el minuto {formatTime(savedProgressSeconds)} o empezar desde el principio?
              </Text>
              <View style={styles.modalButtonsRow}>
                <FocusableItem
                  hasTVPreferredFocus
                  style={styles.modalBtn}
                  focusedStyle={styles.modalBtnFocused}
                  onPress={() => setShowResumeModal(false)}
                >
                  <Text style={styles.modalBtnText}>REANUDAR ({formatTime(savedProgressSeconds)})</Text>
                </FocusableItem>
                <FocusableItem
                  style={[styles.modalBtn, styles.modalBtnSecondary]}
                  onPress={() => {
                    setCurrentTime(0);
                    setShowResumeModal(false);
                  }}
                >
                  <Text style={styles.modalBtnText}>EMPEZAR DESDE EL PRINCIPIO</Text>
                </FocusableItem>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Header Overlay del Reproductor */}
      <View style={styles.headerOverlay}>
        <FocusableItem style={styles.backBtn} onPress={onClosePlayer}>
          <Text style={styles.backText}>← SALIR</Text>
        </FocusableItem>
        <View style={styles.headerInfo}>
          {isLive ? (
            <Text style={styles.liveBadge}>🔴 EN VIVO | {currentChannel.name}</Text>
          ) : (
            <Text style={styles.vodTitle}>{title}</Text>
          )}
        </View>
      </View>

      {/* Aviso de Siguiente Episodio en los últimos 30 segundos (Sección 12) */}
      {!isLive && isNextEpisodeThreshold && (
        <View style={styles.nextEpisodeBanner}>
          <Text style={styles.nextEpisodeText}>
            Siguiente episodio en {durationTime - currentTime}s...
          </Text>
          <FocusableItem style={styles.nextEpisodeBtn} onPress={() => setCurrentTime(0)}>
            <Text style={styles.nextEpisodeBtnText}>REPRODUCIR AHORA</Text>
          </FocusableItem>
        </View>
      )}

      {/* Barra de Controles e Interfaz TV */}
      <View style={styles.controlsOverlay}>
        {/* EPG Info para Live TV */}
        {isLive && (
          <View style={styles.epgBanner}>
            <Text style={styles.epgNowText}>PROGRAMA ACTUAL: {currentChannel.epgTitle} ({currentChannel.epgTime})</Text>
            <FocusableItem
              style={styles.zappingTriggerBtn}
              onPress={() => setShowZapping(!showZapping)}
            >
              <Text style={styles.zappingTriggerText}>⚡ ABRIR ZAPPING RÁPIDO (FLECHAS ARRIBA/ABAJO)</Text>
            </FocusableItem>
          </View>
        )}

        {!isLive && (
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${(currentTime / durationTime) * 100}%` }]} />
            </View>
            <Text style={styles.timeText}>{formatTime(durationTime)}</Text>
          </View>
        )}

        <View style={styles.buttonsBar}>
          {!isLive && (
            <>
              <FocusableItem style={styles.controlBtn} onPress={() => setCurrentTime(Math.max(0, currentTime - 10))}>
                <Text style={styles.btnIcon}>⏪ 10s</Text>
              </FocusableItem>

              <FocusableItem style={styles.controlBtn} onPress={() => setIsPlaying(!isPlaying)}>
                <Text style={styles.btnIcon}>{isPlaying ? '⏸️ PAUSA' : '▶️ PLAY'}</Text>
              </FocusableItem>

              <FocusableItem style={styles.controlBtn} onPress={() => setCurrentTime(Math.min(durationTime, currentTime + 10))}>
                <Text style={styles.btnIcon}>⏩ 10s</Text>
              </FocusableItem>
            </>
          )}

          {/* Calidad de video adaptativa (Sección 10) */}
          <FocusableItem
            style={styles.selectorBtn}
            onPress={() => setQuality(quality.includes('1080p') ? '720p HD' : 'Auto (1080p)')}
          >
            <Text style={styles.selectorText}>📺 Calidad: {quality}</Text>
          </FocusableItem>

          {/* Audio (Sección 11) */}
          <FocusableItem
            style={styles.selectorBtn}
            onPress={() => setAudioTrack(audioTrack === 'Español Latino' ? 'Inglés Original' : 'Español Latino')}
          >
            <Text style={styles.selectorText}>🔊 Audio: {audioTrack}</Text>
          </FocusableItem>

          {/* Subtítulos (Sección 11) */}
          <FocusableItem
            style={styles.selectorBtn}
            onPress={() => setSubtitleTrack(subtitleTrack === 'Desactivado' ? 'Español' : 'Desactivado')}
          >
            <Text style={styles.selectorText}>💬 Subs: {subtitleTrack}</Text>
          </FocusableItem>

          {/* Pantalla Completa */}
          <FocusableItem
            style={[styles.selectorBtn, styles.fullscreenSelectorBtn]}
            onPress={toggleFullscreen}
          >
            <Text style={styles.fullscreenSelectorText}>⛶ Pantalla Completa</Text>
          </FocusableItem>
        </View>
      </View>

      {/* Zapping Overlay Semitransparente (Sección 16) */}
      {showZapping && (
        <ZappingOverlay
          channels={mockChannels}
          currentChannelId={currentChannel.id}
          onSelectChannel={(ch) => setCurrentChannel(ch)}
          onClose={() => setShowZapping(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
  },
  videoCanvasEmoji: {
    fontSize: 48,
    color: '#E50914',
    marginBottom: 10,
  },
  videoCanvasTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 480,
    backgroundColor: '#181818',
    borderRadius: 14,
    padding: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  modalSub: {
    color: '#DDDDDD',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonsRow: {
    gap: 10,
  },
  modalBtn: {
    backgroundColor: '#E50914',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnSecondary: {
    backgroundColor: '#333333',
  },
  modalBtnFocused: {
    borderColor: '#FFD700',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerInfo: {
    marginLeft: 20,
  },
  liveBadge: {
    color: '#FF4D4D',
    fontSize: 18,
    fontWeight: '900',
  },
  vodTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextEpisodeBanner: {
    position: 'absolute',
    right: 30,
    bottom: 120,
    backgroundColor: 'rgba(229, 9, 20, 0.95)',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextEpisodeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nextEpisodeBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  nextEpisodeBtnText: {
    color: '#E50914',
    fontWeight: '900',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 15, 15, 0.85)',
    borderRadius: 12,
    padding: 16,
  },
  epgBanner: {
    marginBottom: 10,
  },
  epgNowText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 15,
  },
  zappingTriggerBtn: {
    backgroundColor: '#262626',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  zappingTriggerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  timeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#444444',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E50914',
  },
  buttonsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlBtn: {
    backgroundColor: '#262626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnIcon: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectorBtn: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectorText: {
    color: '#DDDDDD',
    fontSize: 12,
  },
  fullscreenSelectorBtn: {
    backgroundColor: 'rgba(0, 240, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#00F0FF',
  },
  fullscreenSelectorText: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
