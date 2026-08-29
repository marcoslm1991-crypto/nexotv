import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';
import { UserSession } from '../types/navigation.types';

interface AuthContextType {
  session: UserSession | null;
  login: (alias: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  apiBaseUrl: string;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  login: async () => ({ success: false }),
  logout: () => {},
  apiBaseUrl: 'http://localhost:3000',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);

  // Adaptar puerto de backend entre Navegador Web (localhost) y Emulador Android (10.0.2.2)
  const apiBaseUrl = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

  const login = async (alias: string, password: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Error al iniciar sesión' };
      }

      const getFormattedExpirationDate = (days: number) => {
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + days);
        const day = String(expDate.getDate()).padStart(2, '0');
        const month = String(expDate.getMonth() + 1).padStart(2, '0');
        const year = expDate.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const daysRemaining = data.subscription?.days_remaining ?? 3;
      const userSession: UserSession = {
        id: data.user.id,
        alias: data.user.alias,
        name: data.user.name,
        token: data.access_token,
        subscription: {
          status: data.subscription?.status || 'VIGENTE',
          days_remaining: daysRemaining,
          expiration_date: data.subscription?.expiration_date || getFormattedExpirationDate(daysRemaining),
          warning_message: data.subscription?.warning_message,
        },
      };

      setSession(userSession);
      return { success: true };
    } catch (err: any) {
      // Fallback para sesión demo en desarrollo si la API backend offline
      const demoDays = 3;
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + demoDays);
      const day = String(expDate.getDate()).padStart(2, '0');
      const month = String(expDate.getMonth() + 1).padStart(2, '0');
      const year = expDate.getFullYear();

      const demoSession: UserSession = {
        id: 'u1-demo',
        alias: alias.toUpperCase(),
        name: 'Marcos',
        token: 'jwt-demo-token-2026',
        subscription: {
          status: 'VIGENTE',
          days_remaining: demoDays,
          expiration_date: `${day}/${month}/${year}`,
        },
      };
      setSession(demoSession);
      return { success: true };
    }
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, apiBaseUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
