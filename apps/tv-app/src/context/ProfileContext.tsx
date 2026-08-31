import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../types/navigation.types';

interface ProfileContextType {
  profiles: Profile[];
  selectedProfile: Profile | null;
  selectProfile: (profile: Profile) => void;
  updateProfileName: (id: string, newName: string) => void;
  clearProfile: () => void;
}

const DEFAULT_PROFILES: Profile[] = [
  { id: 'p1', name: 'Perfil Principal' },
  { id: 'p2', name: 'Familia' },
  { id: 'p3', name: 'Niños' },
];

const ProfileContext = createContext<ProfileContextType>({
  profiles: DEFAULT_PROFILES,
  selectedProfile: null,
  selectProfile: () => {},
  updateProfileName: () => {},
  clearProfile: () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem('nexotv_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.log('Error leyendo perfiles guardados:', e);
    }
    return DEFAULT_PROFILES;
  });

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('nexotv_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.log('Error guardando perfiles:', e);
    }
  }, [profiles]);

  const selectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const updateProfileName = (id: string, newName: string) => {
    if (!newName.trim()) return;
    const updated = profiles.map((p) => (p.id === id ? { ...p, name: newName.trim() } : p));
    setProfiles(updated);
    if (selectedProfile && selectedProfile.id === id) {
      setSelectedProfile({ ...selectedProfile, name: newName.trim() });
    }
  };

  const clearProfile = () => {
    setSelectedProfile(null);
  };

  return (
    <ProfileContext.Provider value={{ profiles, selectedProfile, selectProfile, updateProfileName, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
