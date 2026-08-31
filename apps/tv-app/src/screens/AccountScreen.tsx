import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
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
  const { profiles, selectedProfile, updateProfileName } = useProfile();

  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const statusColor = session?.subscription?.status === 'VIGENTE' ? '#00B8FF' : '#FFC107';

  const handleStartEdit = (pId: string, currentName: string) => {
    setEditingProfileId(pId);
    setEditingName(currentName);
  };

  const handleSaveProfileName = () => {
    if (editingProfileId && editingName.trim()) {
      updateProfileName(editingProfileId, editingName);
      setEditingProfileId(null);
    }
  };

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

        {/* Sección de Gestión de Nombres de Perfiles */}
        <Text style={styles.sectionHeader}>👥 GESTIÓN DE PERFILES Y NOMBRES</Text>
        {profiles.map((p) => (
          <View key={p.id} style={styles.profileEditRow}>
            <View style={styles.profileInfo}>
              <View style={[styles.miniAvatar, p.id === 'p1' ? styles.avPrimary : p.id === 'p2' ? styles.avSec : styles.avKids]}>
                <Text style={styles.miniInitial}>{p.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.profileNameText}>{p.name}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleStartEdit(p.id, p.name)}>
              <Text style={styles.editBtnText}>✏️ Cambiar Nombre</Text>
            </TouchableOpacity>
          </View>
        ))}

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

      {/* MODAL DE EDICIÓN DE PERFIL EN MI CUENTA */}
      {editingProfileId && (
        <Modal transparent animationType="fade" visible={!!editingProfileId}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Editar Nombre de Perfil</Text>
              <TextInput
                style={styles.modalInput}
                value={editingName}
                onChangeText={setEditingName}
                placeholder="Nombre del perfil..."
                placeholderTextColor={COLORS.textMuted}
                autoFocus
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingProfileId(null)}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfileName}>
                  <Text style={styles.btnTextBold}>Guardar Nombre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    marginVertical: 16,
  },
  sectionHeader: {
    color: COLORS.electricBlue,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 1,
  },
  profileEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avPrimary: { backgroundColor: COLORS.electricBlue },
  avSec: { backgroundColor: COLORS.neonViolet },
  avKids: { backgroundColor: '#EC4899' },
  miniInitial: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  profileNameText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: 'bold' },
  editBtn: {
    backgroundColor: COLORS.cardBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  editBtnText: { color: COLORS.electricBlue, fontSize: 13, fontWeight: 'bold' },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.electricBlue,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 10,
    padding: 12,
    color: COLORS.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.cardBg,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: COLORS.electricBlue,
  },
  btnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  btnTextBold: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
