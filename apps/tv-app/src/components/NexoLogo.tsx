import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../theme/colors';

interface NexoLogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
}

export const NexoLogo: React.FC<NexoLogoProps> = ({ size = 'medium' }) => {
  const scale = size === 'small' ? 0.75 : size === 'large' ? 1.3 : 1.0;
  const width = 210 * scale;
  const height = 65 * scale;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { width, height }]}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 210 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Degradado oficial Cyan->Violeta->Magenta de la X de la imagen */}
            <linearGradient id="nexoXGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="45%" stopColor="#38BDF8" />
              <stop offset="75%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#C026D3" />
            </linearGradient>

            {/* Degradado metálico 3D para N, E y O */}
            <linearGradient id="silverLettersGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Línea Láser Horizontal */}
            <linearGradient id="laserLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
              <stop offset="30%" stopColor="#00F0FF" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="70%" stopColor="#C026D3" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#C026D3" stopOpacity="0" />
            </linearGradient>

            {/* Resplandor Neón Concentrado sobre la X */}
            <filter id="nexoXGlowCompact" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="1.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* PALABRA NEXO TOTALMENTE UNIFICADA Y COMPACTA (EXACTA A LA FOTO) */}
          <g transform="translate(10, 2)">
            {/* Letras N E juntas */}
            <text
              x="0"
              y="38"
              fill="url(#silverLettersGrad)"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="40"
              fontWeight="900"
              letterSpacing="-0.5"
            >
              NE
            </text>

            {/* La X Héroe Neón integrada justo al lado de la E */}
            <g filter="url(#nexoXGlowCompact)" transform="translate(56, 2)">
              {/* Trazo diagonal \ */}
              <path d="M 4 4 L 40 40" stroke="url(#nexoXGradCompact)" strokeWidth="6.5" strokeLinecap="square" />
              <path d="M 4 4 L 40 40" stroke="#060912" strokeWidth="2.2" strokeLinecap="square" />
              {/* Trazo diagonal / */}
              <path d="M 40 4 L 4 40" stroke="url(#nexoXGradCompact)" strokeWidth="6.5" strokeLinecap="square" />
              <path d="M 40 4 L 4 40" stroke="#060912" strokeWidth="2.2" strokeLinecap="square" />
              {/* Bisel interno brillante */}
              <path d="M 10 4 L 40 34" stroke="#00F0FF" strokeWidth="1" opacity="0.9" />
              <path d="M 4 10 L 34 40" stroke="#C026D3" strokeWidth="1" opacity="0.9" />
            </g>

            {/* Letra O pegada a la X */}
            <rect
              x="101"
              y="7"
              width="34"
              height="33"
              rx="8"
              fill="none"
              stroke="url(#silverLettersGrad)"
              strokeWidth="6.5"
            />

            {/* Destello de Línea Láser Horizontal */}
            <line x1="10" y1="56" x2="135" y2="56" stroke="url(#laserLineGrad)" strokeWidth="1.2" />
            <circle cx="73" cy="56" r="2" fill="#00F0FF" />

            {/* T V Centrado de bajo en la foto */}
            <text
              x="63"
              y="54"
              fill="#E2E8F0"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="11"
              fontWeight="800"
              letterSpacing="6"
            >
              TV
            </text>
          </g>
        </svg>
      </View>
    );
  }

  // Fallback nativo
  return (
    <View style={styles.nativeContainer}>
      <View style={styles.nativeRow}>
        <Text style={styles.nativeText}>NE</Text>
        <Text style={styles.nativeX}>X</Text>
        <Text style={styles.nativeText}>O</Text>
      </View>
      <Text style={styles.nativeTv}>T  V</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativeContainer: {
    alignItems: 'center',
  },
  nativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nativeText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
  },
  nativeX: {
    color: '#00F0FF',
    fontSize: 40,
    fontWeight: '900',
    marginHorizontal: 1,
    textShadowColor: '#C026D3',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  nativeTv: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 6,
    marginTop: 2,
  },
});
