import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions, TouchableOpacity, ScrollView } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { RootScreen } from './types/navigation.types';
import { LoginScreen } from './screens/LoginScreen';
import { ProfileSelectionScreen } from './screens/ProfileSelectionScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LiveTVScreen } from './screens/LiveTVScreen';
import { SeriesScreen } from './screens/SeriesScreen';
import { MoviesScreen } from './screens/MoviesScreen';
import { AccountScreen } from './screens/AccountScreen';
import { SideMenu } from './components/SideMenu';
import { HeaderTopBar } from './components/HeaderTopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { NexoLogo } from './components/NexoLogo';
import { COLORS } from './theme/colors';

function MainAppNavigator() {
  const auth = useAuth();
  const profile = useProfile();
  const [currentScreen, setCurrentScreen] = useState<RootScreen>('HOME');
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const { width, height } = useWindowDimensions();
  const isMobile = Math.min(width, height) < 768;

  const selectedProfile = profile ? profile.selectedProfile : null;
  const daysRemaining = auth.session?.subscription?.days_remaining ?? 3;
  const expirationDate = auth.session?.subscription?.expiration_date || '30/08/2026';

  // Mostrar mensaje temporal al ingresar si quedan 3 días o menos de suscripción
  React.useEffect(() => {
    if (auth.session && daysRemaining <= 3) {
      setShowLoginWarning(true);
      const timer = setTimeout(() => {
        setShowLoginWarning(false);
      }, 8000); // Se oculta automáticamente tras 8 segundos
      return () => clearTimeout(timer);
    }
  }, [auth.session?.id]);

  if (currentScreen === 'LOGIN') {
    return <LoginScreen onSuccess={() => setCurrentScreen('PROFILE_SELECTION')} />;
  }

  if (currentScreen === 'PROFILE_SELECTION' || !selectedProfile) {
    return <ProfileSelectionScreen onSelect={() => setCurrentScreen('HOME')} />;
  }

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen onNavigateLive={() => setCurrentScreen('LIVE_TV')} />;
      case 'LIVE_TV':
        return <LiveTVScreen />;
      case 'SERIES':
        return <SeriesScreen />;
      case 'MOVIES':
        return <MoviesScreen />;
      case 'MY_LIST':
        return <MoviesScreen />;
      case 'ACCOUNT':
        return (
          <AccountScreen
            onLogout={() => {
              if (auth && auth.logout) auth.logout();
              setCurrentScreen('LOGIN');
            }}
            onChangeProfile={() => {
              if (profile && profile.clearProfile) profile.clearProfile();
              setCurrentScreen('PROFILE_SELECTION');
            }}
          />
        );
      default:
        return <HomeScreen onNavigateLive={() => setCurrentScreen('LIVE_TV')} />;
    }
  };

  const renderLoginWarningBanner = () => {
    if (!showLoginWarning || daysRemaining > 3) return null;
    return (
      <View style={styles.loginWarningBanner}>
        <View style={styles.loginWarningHeader}>
          <Text style={styles.loginWarningTitle}>⚠️ AVISO DE PRÓXIMO VENCIMIENTO</Text>
          <TouchableOpacity onPress={() => setShowLoginWarning(false)} style={styles.loginWarningCloseBtn}>
            <Text style={styles.loginWarningCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.loginWarningBody}>
          Tu mensualidad de NexoTV vence en <Text style={styles.highlightText}>{daysRemaining} días</Text> ({expirationDate}). Recordá renovar tu abono para continuar disfrutando el servicio.
        </Text>
        <TouchableOpacity style={styles.loginWarningBtn} onPress={() => setShowLoginWarning(false)}>
          <Text style={styles.loginWarningBtnText}>ENTENDIDO</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        {/* Banner de Notificación Temporal al Iniciar Sesión */}
        {renderLoginWarningBanner()}

        {/* Header superior móvil estilo Imagen 1 */}
        <View style={styles.mobileHeader}>
          <View style={styles.mobileTopRow}>
            <NexoLogo size="small" showSubtitle={false} />
            <View style={styles.mobileHeaderIcons}>
              {/* Contenedor con Fecha de Vencimiento ARRIBA de Mi Cuenta (Imagen 1) */}
              <View style={styles.accountWithExpirationBox}>
                <Text style={styles.expirationBadgeText}>Vence: {expirationDate}</Text>
                <TouchableOpacity
                  style={[styles.accountBadgeBtn, currentScreen === 'ACCOUNT' && styles.accountBadgeBtnActive]}
                  onPress={() => setCurrentScreen('ACCOUNT')}
                >
                  <Text style={styles.accountBadgeText}>👤 Mi Cuenta</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.iconButton} onPress={() => alert('Transmitir a TV (Chromecast)')}>
                <Text style={styles.iconSymbol}>📺</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Solapas de Navegación Rápida Superior (Con Mi Cuenta incluida) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topTabsScroll}>
            <TouchableOpacity
              style={[styles.topTabPill, currentScreen === 'HOME' && styles.topTabPillActive]}
              onPress={() => setCurrentScreen('HOME')}
            >
              <Text style={[styles.topTabText, currentScreen === 'HOME' && styles.topTabTextActive]}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.topTabPill, currentScreen === 'LIVE_TV' && styles.topTabPillActive]}
              onPress={() => setCurrentScreen('LIVE_TV')}
            >
              <Text style={[styles.topTabText, currentScreen === 'LIVE_TV' && styles.topTabTextActive]}>TV en Vivo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.topTabPill, currentScreen === 'MOVIES' && styles.topTabPillActive]}
              onPress={() => setCurrentScreen('MOVIES')}
            >
              <Text style={[styles.topTabText, currentScreen === 'MOVIES' && styles.topTabTextActive]}>Películas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.topTabPill, currentScreen === 'SERIES' && styles.topTabPillActive]}
              onPress={() => setCurrentScreen('SERIES')}
            >
              <Text style={[styles.topTabText, currentScreen === 'SERIES' && styles.topTabTextActive]}>Series</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.topTabPill, currentScreen === 'ACCOUNT' && styles.topTabPillActive]}
              onPress={() => setCurrentScreen('ACCOUNT')}
            >
              <Text style={[styles.topTabText, currentScreen === 'ACCOUNT' && styles.topTabTextActive]}>⚙️ Mi Cuenta</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Contenido Principal */}
        <View style={styles.mobileScreenArea}>
          {renderScreenContent()}
        </View>

        {/* Barra de Navegación Inferior Fija (Bottom Bar) */}
        <BottomNavBar
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      </View>
    );
  }

  // Vista de Escritorio / Smart TV (Modo 16:9 con SideMenu)
  return (
    <View style={styles.appWrapper}>
      <SideMenu
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />
      <View style={styles.screenArea}>
        <HeaderTopBar />
        {renderScreenContent()}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={false} barStyle="light-content" backgroundColor="#0F131C" />
      <AuthProvider>
        <ProfileProvider>
          <MainAppNavigator />
        </ProfileProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F131C',
  },
  appWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0F131C',
  },
  screenArea: {
    flex: 1,
    backgroundColor: '#0F131C',
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: '#0F131C',
    flexDirection: 'column',
  },
  mobileHeader: {
    backgroundColor: '#0F131C',
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  mobileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mobileHeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accountBadgeBtn: {
    backgroundColor: 'rgba(0, 184, 255, 0.15)',
    borderColor: COLORS.electricBlue,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  accountBadgeBtnActive: {
    backgroundColor: COLORS.neonViolet,
    borderColor: COLORS.intenseViolet,
  },
  accountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconSymbol: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  topTabsScroll: {
    flexDirection: 'row',
  },
  topTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    backgroundColor: 'transparent',
  },
  topTabPillActive: {
    backgroundColor: COLORS.neonViolet,
  },
  topTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  topTabTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mobileScreenArea: {
    flex: 1,
    backgroundColor: '#0F131C',
  },
  accountWithExpirationBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  expirationBadgeText: {
    color: '#00F0FF',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  loginWarningBanner: {
    backgroundColor: '#1E1B4B',
    borderColor: '#6366F1',
    borderWidth: 1.5,
    borderRadius: 12,
    margin: 12,
    padding: 14,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  loginWarningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  loginWarningTitle: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  loginWarningCloseBtn: {
    padding: 4,
  },
  loginWarningCloseText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginWarningBody: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  highlightText: {
    color: '#00F0FF',
    fontWeight: 'bold',
  },
  loginWarningBtn: {
    backgroundColor: COLORS.neonViolet,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  loginWarningBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
