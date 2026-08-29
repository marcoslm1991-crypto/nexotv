import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { FocusableItem } from '../components/FocusableItem';
import { COLORS } from '../theme/colors';

interface AccountScreenProps {
  onLogout: () => void;
  onChangeProfile: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onLogout, onChangeProfile }) => {
  const { session, logout } = useAuth();
  const { selectedProfile } = useProfile();

  const statusColor = session?.subscription?.status === 'VIGENTE' ? '#00B8FF' : '#FFC107';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ AJUSTES & MI CUENTA</Text>

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Usuario / Alias:</Text>
          <Text style={styles.value}>{session?.alias || 'MARCOS01'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Perfil Activo:</Text>
          <Text style={styles.value}>{selectedProfile?.name || 'Perfil Principal'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Plan Contratado:</Text>
          <Text style={styles.valueHighlight}>Familiar 4K</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Pantallas Simultáneas:</Text>
          <Text style={styles.value}>3 pantallas</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha de Vencimiento:</Text>
          <Text style={styles.value}>
            {session?.subscription?.expiration_date || '30/08/2026'} (Faltan {session?.subscription?.days_remaining ?? 3} días)
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado de Suscripción:</Text>
          <Text style={[styles.statusBadge, { color: statusColor }]}>
            {session?.subscription?.status || 'Vigente'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Calidad de Video Preferida:</Text>
          <Text style={styles.value}>Auto (4K Ultra HD)</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Reproducción Automática:</Text>
          <Text style={styles.value}>Sí (Siguiente episodio)</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Idioma Subtítulos:</Text>
          <Text style={styles.value}>Español Latino</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Versión de la Aplicación:</Text>
          <Text style={styles.value}>2.0.0 (NexoTV Premium OS)</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <FocusableItem
          style={styles.actionBtn}
          focusedStyle={styles.actionBtnFocused}
          onPress={onChangeProfile}
        >
          <Text style={styles.actionText}>CAMBIAR DE PERFIL</Text>
        </FocusableItem>

        <FocusableItem
          style={[styles.actionBtn, styles.logoutBtn]}
          focusedStyle={styles.logoutBtnFocused}
          onPress={() => {
            logout();
            onLogout();
          }}
        >
          <Text style={styles.actionText}>CERRAR SESIÓN</Text>
        </FocusableItem>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  content: {
    padding: 30,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  valueHighlight: {
    color: COLORS.electricBlue,
    fontSize: 15,
    fontWeight: '900',
  },
  statusBadge: {
    fontSize: 15,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderDark,
    marginVertical: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  actionBtn: {
    backgroundColor: COLORS.cardBg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  actionBtnFocused: {
    backgroundColor: COLORS.cardBgHover,
    borderColor: COLORS.electricBlue,
  },
  logoutBtn: {
    backgroundColor: COLORS.neonViolet,
    borderColor: COLORS.intenseViolet,
  },
  logoutBtnFocused: {
    backgroundColor: COLORS.intenseViolet,
  },
  actionText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
