import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { TVKeypad } from '../components/TVKeypad';
import { NexoLogo } from '../components/NexoLogo';
import { COLORS } from '../theme/colors';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [activeField, setActiveField] = useState<'ALIAS' | 'PASSWORD'>('ALIAS');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDigit = (digit: string) => {
    setError(null);
    if (activeField === 'ALIAS') {
      setAlias((prev) => prev + digit);
    } else {
      setPassword((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setError(null);
    if (activeField === 'ALIAS') {
      setAlias((prev) => prev.slice(0, -1));
    } else {
      setPassword((prev) => prev.slice(0, -1));
    }
  };

  const handleLoginSubmit = async () => {
    if (!alias.trim() || !password.trim()) {
      setError('Por favor ingresá tu usuario y contraseña');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await login(alias.trim(), password.trim());
      setLoading(false);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || 'Credenciales inválidas. Verificá tu usuario y PIN.');
      }
    } catch (e: any) {
      setLoading(false);
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="always">
      <View style={styles.card}>
        <View style={styles.logoWrapper}>
          <NexoLogo size="large" showSubtitle={true} />
        </View>

        {error && <Text style={styles.errorBanner}>{error}</Text>}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Usuario / Alias:</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => setActiveField('ALIAS')}>
            <TextInput
              style={[styles.inputText, activeField === 'ALIAS' && styles.inputActive]}
              value={alias}
              onChangeText={(text) => {
                setAlias(text);
                setActiveField('ALIAS');
              }}
              placeholder="Ingresá tu usuario"
              placeholderTextColor={COLORS.textSecondary}
              editable={true}
              onFocus={() => setActiveField('ALIAS')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contraseña / PIN (4 dígitos):</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => setActiveField('PASSWORD')}>
            <TextInput
              style={[styles.inputText, activeField === 'PASSWORD' && styles.inputActive]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setActiveField('PASSWORD');
              }}
              placeholder="PIN de 4 dígitos"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={false}
              editable={true}
              keyboardType="numeric"
              onFocus={() => setActiveField('PASSWORD')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.keypadWrapper}>
          <TVKeypad
            onPressDigit={handleDigit}
            onDelete={handleDelete}
            onSubmit={handleLoginSubmit}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.submitBtn}
          onPress={handleLoginSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>🚀 INICIAR SESIÓN</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    maxWidth: 440,
    padding: 24,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    shadowColor: COLORS.neonViolet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  logoWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    borderColor: '#E50914',
    borderWidth: 1,
    color: '#FF6B6B',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formGroup: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  inputText: {
    backgroundColor: COLORS.cardBg,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  inputActive: {
    borderColor: COLORS.electricBlue,
    backgroundColor: COLORS.cardBgHover,
  },
  keypadWrapper: {
    marginVertical: 10,
  },
  submitBtn: {
    backgroundColor: COLORS.neonViolet,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.intenseViolet,
    shadowColor: COLORS.electricBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  submitText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
