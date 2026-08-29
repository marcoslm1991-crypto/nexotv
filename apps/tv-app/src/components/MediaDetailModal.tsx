import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';

interface MediaDetailModalProps {
  visible: boolean;
  item: {
    title: string;
    category?: string;
    year?: number;
    duration?: string;
    rating?: string;
    synopsis?: string;
    posterEmoji?: string;
    streamUrl?: string;
    cast?: string[];
  } | null;
  onClose: () => void;
  onPlay: () => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  visible,
  item,
  onClose,
  onPlay,
}) => {
  if (!visible || !item) return null;

  const defaultCast = ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Josh Brolin'];

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.detailCard}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header Cinematográfico */}
            <View style={styles.heroSection}>
              <View style={styles.posterBox}>
                <Text style={styles.posterEmoji}>{item.posterEmoji || '🎬'}</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.tagText}>PELÍCULA DESTACADA</Text>
                <Text style={styles.titleText}>{item.title}</Text>
                
                <View style={styles.metaRow}>
                  <Text style={styles.metaYear}>{item.year || 2024}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.metaDuration}>{item.duration || '2h 46m'}</Text>
                  <Text style={styles.dot}>•</Text>
                  <View style={styles.badge4k}><Text style={styles.text4k}>4K HDR</Text></View>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.ratingText}>★ {item.rating || '8.7'}</Text>
                </View>

                <Text style={styles.synopsisText}>
                  {item.synopsis || 'Paul Atreides se une a los Fremen y comienza un viaje espiritual y marcial para convertirse en Muad\'Dib, mientras intenta evitar el terrible futuro que solo él puede prever.'}
                </Text>

                {/* Botón Principal de Reproducción */}
                <TouchableOpacity style={styles.playBigBtn} onPress={onPlay}>
                  <Text style={styles.playBigText}>▶  VER AHORA</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Barra de Acciones de Usuario */}
            <View style={styles.actionsBar}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Agregado a Mi Lista')}>
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionLabel}>Mi Lista</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Calificado con ★★★★★')}>
                <Text style={styles.actionIcon}>⭐</Text>
                <Text style={styles.actionLabel}>Calificar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Iniciando descarga HD')}>
                <Text style={styles.actionIcon}>📥</Text>
                <Text style={styles.actionLabel}>Descargar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Enlace copiado')}>
                <Text style={styles.actionIcon}>🔗</Text>
                <Text style={styles.actionLabel}>Compartir</Text>
              </TouchableOpacity>
            </View>

            {/* Sección Reparto */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Reparto Principal</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castRow}>
                {(item.cast || defaultCast).map((actor, idx) => (
                  <View key={`actor-${idx}`} style={styles.actorCard}>
                    <View style={styles.actorAvatar}>
                      <Text style={styles.actorInitial}>{actor.charAt(0)}</Text>
                    </View>
                    <Text style={styles.actorName}>{actor}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Contenido Similar */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Contenido Similar Recomendado</Text>
              <View style={styles.similarGrid}>
                <View style={styles.similarCard}>
                  <Text style={styles.similarEmoji}>🚀</Text>
                  <Text style={styles.similarTitle}>INTERESTELAR</Text>
                  <Text style={styles.similarMatch}>98% MATCH</Text>
                </View>

                <View style={styles.similarCard}>
                  <Text style={styles.similarEmoji}>🌆</Text>
                  <Text style={styles.similarTitle}>BLADE RUNNER</Text>
                  <Text style={styles.similarMatch}>95% MATCH</Text>
                </View>

                <View style={styles.similarCard}>
                  <Text style={styles.similarEmoji}>🦑</Text>
                  <Text style={styles.similarTitle}>EL CALAMAR</Text>
                  <Text style={styles.similarMatch}>93% MATCH</Text>
                </View>
              </View>
            </View>
          </ScrollView>
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
  detailCard: {
    width: 760,
    maxHeight: '90%',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.electricBlue,
    padding: 24,
    position: 'relative',
    shadowColor: COLORS.neonViolet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 20,
  },
  posterBox: {
    width: 180,
    height: 240,
    borderRadius: 14,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  posterEmoji: {
    fontSize: 72,
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  tagText: {
    color: COLORS.electricBlue,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  titleText: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  metaYear: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  metaDuration: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  dot: {
    color: COLORS.textSecondary,
  },
  badge4k: {
    backgroundColor: 'rgba(0, 184, 255, 0.15)',
    borderColor: COLORS.electricBlue,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  text4k: {
    color: COLORS.electricBlue,
    fontSize: 10,
    fontWeight: 'bold',
  },
  ratingText: {
    color: COLORS.neonViolet,
    fontSize: 13,
    fontWeight: 'bold',
  },
  synopsisText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  playBigBtn: {
    backgroundColor: COLORS.neonViolet,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.intenseViolet,
    shadowColor: COLORS.electricBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  playBigText: {
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.cardBg,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  actionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  castRow: {
    flexDirection: 'row',
  },
  actorCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  actorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.cardBgHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.electricBlue,
  },
  actorInitial: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  actorName: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  similarGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  similarCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  similarEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  similarTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  similarMatch: {
    color: COLORS.electricBlue,
    fontSize: 10,
    fontWeight: '900',
  },
});
