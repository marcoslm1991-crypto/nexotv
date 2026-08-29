import React, { createContext, useContext, useState } from 'react';
import { Profile } from '../types/navigation.types';

interface ProfileContextType {
  selectedProfile: Profile | null;
  selectProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType>({
  selectedProfile: null,
  selectProfile: () => {},
  clearProfile: () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const selectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const clearProfile = () => {
    setSelectedProfile(null);
  };

  return (
    <ProfileContext.Provider value={{ selectedProfile, selectProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
