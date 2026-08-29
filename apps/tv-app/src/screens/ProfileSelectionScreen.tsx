import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useProfile } from '../context/ProfileContext';
import { Profile } from '../types/navigation.types';
import { COLORS } from '../theme/colors';
import { NexoLogo } from '../components/NexoLogo';

interface ProfileSelectionScreenProps {
  onSelect: () => void;
}

export const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ onSelect }) => {
  const { selectProfile } = useProfile();
  const { width, height } = useWindowDimensions();
  const isMobile = Math.min(width, height) < 768;

  const [profiles] = useState<Profile[]>([
    { id: 'p1', name: 'Perfil Principal' },
    { id: 'p2', name: 'Familia' },
    { id: 'p3', name: 'Niños' },
  ]);

  const handleChoose = (p: Profile) => {
    selectProfile(p);
    onSelect();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isMobile && styles.mobileContainer]}>
      <View style={styles.logoBox}>
        <NexoLogo size={isMobile ? "medium" : "large"} showSubtitle={true} />
      </View>

      <Text style={[styles.headerTitle, isMobile && styles.mobileHeaderTitle]}>¿Quién está viendo ahora?</Text>
      <Text style={[styles.headerSubtitle, isMobile && styles.mobileHeaderSubtitle]}>Seleccioná un perfil para continuar</Text>

      <View style={[styles.profilesGrid, isMobile && styles.mobileProfilesGrid]}>
        {profiles.map((p, idx) => (
          <TouchableOpacity
            key={p.id}
            activeOpacity={0.7}
            style={[
              styles.profileCard,
              idx === 0 && styles.profileCardPrimary,
              isMobile && styles.mobileProfileCard,
            ]}
            onPress={() => handleChoose(p)}
          >
            <View style={[
              styles.avatarCircle,
              idx === 0 ? styles.avatarPrimary : styles.avatarSecondary,
              isMobile && styles.mobileAvatarCircle,
            ]}>
              <Text style={[styles.avatarInitial, isMobile && styles.mobileAvatarInitial]}>
                {p.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.profileName, isMobile && styles.mobileProfileName]} numberOfLines={1}>
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  },
  mobileProfilesGrid: {
    gap: 12,
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
    shadowColor: COLORS.neonViolet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
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
});
