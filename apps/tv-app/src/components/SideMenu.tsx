import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FocusableItem } from './FocusableItem';
import { RootScreen } from '../types/navigation.types';
import { NexoLogo } from './NexoLogo';

interface SideMenuProps {
  currentScreen: RootScreen;
  onNavigate: (screen: RootScreen, categoryFilter?: string) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ currentScreen, onNavigate }) => {
  // Renderizado SVG de iconos de la foto (Casa, Claqueta, TV, Antena, Corazón, Reloj, Engranaje)
  const renderSvgIcon = (type: string, isActive: boolean) => {
    const strokeColor = isActive ? '#FFFFFF' : '#94A3B8';
    const fillColor = isActive ? '#FFFFFF' : 'none';

    if (Platform.OS !== 'web') {
      const emojiMap: Record<string, string> = {
        HOME: '🏠',
        MOVIES: '🎬',
        SERIES: '📺',
        LIVE_TV: '📡',
        MY_LIST: '♡',
        HISTORY: '🕒',
        ACCOUNT: '⚙️',
      };
      return <Text style={{ color: strokeColor, fontSize: 16 }}>{emojiMap[type] || '•'}</Text>;
    }

    switch (type) {
      case 'HOME':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case 'MOVIES':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3"></rect>
            <path d="M2 8h20"></path>
            <path d="M6 4v4"></path>
            <path d="M10 4v4"></path>
            <path d="M14 4v4"></path>
            <path d="M18 4v4"></path>
          </svg>
        );
      case 'SERIES':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="14" rx="3"></rect>
            <path d="M17 2l-5 4-5-4"></path>
          </svg>
        );
      case 'LIVE_TV':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.93 4.93a10 10 0 0 1 14.14 0"></path>
            <path d="M7.76 7.76a6 6 0 0 1 8.48 0"></path>
            <circle cx="12" cy="12" r="2" fill={strokeColor}></circle>
            <path d="M12 14v8"></path>
          </svg>
        );
      case 'MY_LIST':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        );
      case 'HISTORY':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case 'ACCOUNT':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.menuContainer}>
      <View style={styles.brandBox}>
        <NexoLogo size="medium" />
      </View>

      <View style={styles.menuItemsList}>
        {/* 1. Inicio */}
        <FocusableItem
          style={[styles.menuItem, currentScreen === 'HOME' && styles.menuItemActivePill]}
          onPress={() => onNavigate('HOME')}
        >
          <View style={styles.itemRow}>
            <View style={styles.iconWrapper}>{renderSvgIcon('HOME', currentScreen === 'HOME')}</View>
            <Text style={[styles.menuText, currentScreen === 'HOME' && styles.menuTextActive]}>
              Inicio
            </Text>
          </View>
        </FocusableItem>

        {/* 2. Películas */}
        <FocusableItem
          style={[styles.menuItem, currentScreen === 'MOVIES' && styles.menuItemActivePill]}
          onPress={() => onNavigate('MOVIES')}
        >
          <View style={styles.itemRow}>
            <View style={styles.iconWrapper}>{renderSvgIcon('MOVIES', currentScreen === 'MOVIES')}</View>
            <Text style={[styles.menuText, currentScreen === 'MOVIES' && styles.menuTextActive]}>
              Películas
            </Text>
          </View>
        </FocusableItem>

        {/* 3. Series */}
        <FocusableItem
          style={[styles.menuItem, currentScreen === 'SERIES' && styles.menuItemActivePill]}
          onPress={() => onNavigate('SERIES')}
        >
          <View style={styles.itemRow}>
            <View style={styles.iconWrapper}>{renderSvgIcon('SERIES', currentScreen === 'SERIES')}</View>
            <Text style={[styles.menuText, currentScreen === 'SERIES' && styles.menuTextActive]}>
              Series
            </Text>
          </View>
        </FocusableItem>

        {/* 4. TV en Vivo */}
        <FocusableItem
          style={[styles.menuItem, currentScreen === 'LIVE_TV' && styles.menuItemActivePill]}
          onPress={() => onNavigate('LIVE_TV')}
        >
          <View style={styles.itemRow}>
            <View style={styles.iconWrapper}>{renderSvgIcon('LIVE_TV', currentScreen === 'LIVE_TV')}</View>
            <Text style={[styles.menuText, currentScreen === 'LIVE_TV' && styles.menuTextActive]}>
              TV en Vivo
            </Text>
          </View>
        </FocusableItem>

        {/* 5. Mi Lista */}
        <FocusableItem
          style={[styles.menuItem, currentScreen === 'MY_LIST' && styles.menuItemActivePill]}
          onPress={() => onNavigate('MY_LIST')}
        >
          <View style={styles.itemRow}>
            <View style={styles.iconWrapper}>{renderSvgIcon('MY_LIST', currentScreen === 'MY_LIST')}</View>
            <Text style={[styles.menuText, currentScreen === 'MY_LIST' && styles.menuTextActive]}>
              Mi Lista
            </Text>
          </View>
        </FocusableItem>

        {/* 6. Historial */}
        <FocusableItem
          style={styles.menuItem}
          onPress={() => onNavigate('HOME')}
        >
          <View style={styles.itemRow}>
            <View style={styles.iconWrapper}>{renderSvgIcon('HISTORY', false)}</View>
            <Text style={styles.menuText}>Historial</Text>
          </View>
        </FocusableItem>

        {/* 7. Ajustes */}
        <FocusableItem
          style={[styles.menuItem, currentScreen === 'ACCOUNT' && styles.menuItemActivePill]}
          onPress={() => onNavigate('ACCOUNT')}
        >
          <View style={styles.itemRow}>
            <View style={styles.iconWrapper}>{renderSvgIcon('ACCOUNT', currentScreen === 'ACCOUNT')}</View>
            <Text style={[styles.menuText, currentScreen === 'ACCOUNT' && styles.menuTextActive]}>
              Ajustes
            </Text>
          </View>
        </FocusableItem>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    width: 220,
    backgroundColor: '#060912',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandBox: {
    marginBottom: 36,
    alignItems: 'center',
  },
  menuItemsList: {
    flex: 1,
    gap: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  // Píldora activa idéntica a la imagen: Degradado Azul->Violeta Neón + Halo exterior brillante
  menuItemActivePill: {
    backgroundColor: '#0052D4',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C026D3',
    shadowColor: '#C026D3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
