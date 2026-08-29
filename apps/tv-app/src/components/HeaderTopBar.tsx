import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme/colors';
import { NexoLogo } from './NexoLogo';

interface HeaderTopBarProps {
  onSearch?: (text: string) => void;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({ onSearch }) => {
  const { session } = useAuth();
  const userName = session?.alias || 'Marcos';
  const daysRemaining = session?.subscription?.days_remaining ?? 3;
  const expirationDate = session?.subscription?.expiration_date || '30/08/2026';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftGroup}>
        <NexoLogo size="small" showSubtitle={false} />
      </View>

      {/* Barra de Búsqueda Futurista */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar películas, series, canales o actores..."
          placeholderTextColor={COLORS.textSecondary}
          onChangeText={onSearch}
        />
      </View>

      {/* Widget Derecho de Notificaciones, Usuario y Estado de Suscripción */}
      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => alert('No hay notificaciones nuevas')}>
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>

        <View style={styles.subscriptionBadge}>
          <Text style={styles.subTextMuted}>Vencimiento: {expirationDate}</Text>
          <Text style={styles.daysText}>{daysRemaining} DÍAS RESTANTES</Text>
        </View>

        <TouchableOpacity style={styles.renewBtn} onPress={() => alert('Renovación de Plan NexoTV')}>
          <Text style={styles.renewText}>RENOVAR PLAN</Text>
        </TouchableOpacity>

        <View style={styles.profileAvatarBox}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userNameText}>{userName}</Text>
            <Text style={styles.userPlanText}>Plan 4K</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: COLORS.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    width: 380,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
    color: COLORS.textSecondary,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  iconText: {
    fontSize: 16,
  },
  subscriptionBadge: {
    alignItems: 'flex-end',
  },
  subTextMuted: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  daysText: {
    color: COLORS.electricBlue,
    fontSize: 12,
    fontWeight: '900',
  },
  renewBtn: {
    backgroundColor: COLORS.neonViolet,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.intenseViolet,
    shadowColor: COLORS.electricBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  renewText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  profileAvatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.electricBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarLetter: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userNameText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  userPlanText: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
});
