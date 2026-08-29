import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { RootScreen } from '../types/navigation.types';

interface BottomNavBarProps {
  currentScreen: RootScreen;
  onNavigate: (screen: RootScreen) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('HOME')}>
        <Text style={[styles.icon, currentScreen === 'HOME' && styles.iconActive]}>🏠</Text>
        <Text style={[styles.label, currentScreen === 'HOME' && styles.labelActive]}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('LIVE_TV')}>
        <Text style={[styles.icon, currentScreen === 'LIVE_TV' && styles.iconActive]}>📺</Text>
        <Text style={[styles.label, currentScreen === 'LIVE_TV' && styles.labelActive]}>TV en Vivo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('MOVIES')}>
        <Text style={[styles.icon, (currentScreen === 'MOVIES' || currentScreen === 'SERIES') && styles.iconActive]}>🎬</Text>
        <Text style={[styles.label, (currentScreen === 'MOVIES' || currentScreen === 'SERIES') && styles.labelActive]}>Películas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('ACCOUNT')}>
        <Text style={[styles.icon, currentScreen === 'ACCOUNT' && styles.iconActive]}>👤</Text>
        <Text style={[styles.label, currentScreen === 'ACCOUNT' && styles.labelActive]}>Mi Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    height: 62,
    backgroundColor: '#0F131C',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingBottom: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  icon: {
    fontSize: 18,
    color: '#94A3B8',
    marginBottom: 2,
  },
  iconActive: {
    color: COLORS.electricBlue,
  },
  label: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.electricBlue,
    fontWeight: 'bold',
  },
});
