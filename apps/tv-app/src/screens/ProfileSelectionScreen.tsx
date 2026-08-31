import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, useWindowDimensions, Modal } from 'react-native';
import { useProfile } from '../context/ProfileContext';
import { Profile } from '../types/navigation.types';
import { COLORS } from '../theme/colors';
import { NexoLogo } from '../components/NexoLogo';

interface ProfileSelectionScreenProps {
  onSelect: () => void;
}

export const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ onSelect }) => {
  const { profiles, selectProfile, updateProfileName } = useProfile();
  const { width, height } = useWindowDimensions();
  const isMobile = Math.min(width, height) < 768;

  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [tempName, setTempName] = useState('');

  const handleChoose = (p: Profile) => {
    if (isEditing) {
      setEditingProfile(p);
      setTempName(p.name);
    } else {
      selectProfile(p);
      onSelect();
    }
  };

  const handleSaveName = () => {
    if (editingProfile && tempName.trim()) {
      updateProfileName(editingProfile.id, tempName);
      setEditingProfile(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isMobile && styles.mobileContainer]}>
      <View style={styles.logoBox}>
        <NexoLogo size={isMobile ? "medium" : "large"} showSubtitle={true} />
      </View>

      <Text style={[styles.headerTitle, isMobile && styles.mobileHeaderTitle]}>
        {isEditing ? '✏️ Seleccioná un Perfil para Renombrar' : '¿Quién está viendo ahora?'}
      </Text>
      <Text style={[styles.headerSubtitle, isMobile && styles.mobileHeaderSubtitle]}>
        {isEditing ? 'Tocá en cualquier tarjeta para cambiar su nombre' : 'Seleccioná un perfil para ingresar'}
      </Text>

      <View style={[styles.profilesGrid, isMobile && styles.mobileProfilesGrid]}>
        {profiles.map((p, idx) => (
          <TouchableOpacity
            key={p.id}
            activeOpacity={0.7}
            style={[
              styles.profileCard,
              idx === 0 && styles.profileCardPrimary,
              isEditing && styles.profileCardEditing,
              isMobile && styles.mobileProfileCard,
            ]}
            onPress={() => handleChoose(p)}
          >
            <View style={[
              styles.avatarCircle,
              idx === 0 ? styles.avatarPrimary : idx === 1 ? styles.avatarSecondary : styles.avatarKids,
              isMobile && styles.mobileAvatarCircle,
            ]}>
              <Text style={[styles.avatarInitial, isMobile && styles.mobileAvatarInitial]}>
                {p.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.profileName, isMobile && styles.mobileProfileName]} numberOfLines={1}>
              {p.name}
            </Text>
            {isEditing && (
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>✏️ Editar</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón para activar/desactivar la edición de perfiles */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.manageBtn, isEditing && styles.manageBtnActive]}
        onPress={() => setIsEditing(!isEditing)}
      >
        <Text style={styles.manageBtnText}>
          {isEditing ? '✓ FINALIZAR EDICIÓN' : '✏️ ADMINISTRAR / CAMBIAR NOMBRES'}
        </Text>
      </TouchableOpacity>

      {/* MODAL PARA CAMBIAR NOMBRE DE PERFIL */}
      {editingProfile && (
        <Modal transparent animationType="fade" visible={!!editingProfile}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Editar Nombre de Perfil</Text>
              <Text style={styles.modalSub}>Nombre actual: {editingProfile.name}</Text>
              <TextInput
                style={styles.modalInput}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Ej: Marcos, Habitación, Niños..."
                placeholderTextColor={COLORS.textMuted}
                autoFocus
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingProfile(null)}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName}>
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
    flexGrow: 1,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mobileContainer: {
    padding: 16,
    paddingTop: 30,
  },
  logoBox: {
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 6,
    textAlign: 'center',
  },
  mobileHeaderTitle: {
    fontSize: 22,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginBottom: 28,
    textAlign: 'center',
  },
  mobileHeaderSubtitle: {
    fontSize: 13,
    marginBottom: 20,
  },
  profilesGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  mobileProfilesGrid: {
    gap: 12,
    marginBottom: 20,
  },
  profileCard: {
    width: 150,
    height: 170,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
  },
  mobileProfileCard: {
    width: 105,
    height: 125,
    borderRadius: 14,
    padding: 8,
  },
  profileCardPrimary: {
    borderColor: COLORS.electricBlue,
  },
  profileCardEditing: {
    borderColor: COLORS.gold,
    borderStyle: 'dashed',
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mobileAvatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  avatarPrimary: {
    backgroundColor: COLORS.electricBlue,
  },
  avatarSecondary: {
    backgroundColor: COLORS.neonViolet,
  },
  avatarKids: {
    backgroundColor: '#EC4899',
  },
  avatarInitial: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '900',
  },
  mobileAvatarInitial: {
    fontSize: 22,
  },
  profileName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mobileProfileName: {
    fontSize: 11,
  },
  editBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  editBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: 'bold',
  },
  manageBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  manageBtnActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  manageBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    marginBottom: 6,
  },
  modalSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
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
