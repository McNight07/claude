import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import { GradientButton } from '../../components/GradientButton';
import { TextField } from '../../components/TextField';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>🧭</Text>
          <Text style={[styles.title, { color: theme.text }]}>Tech Career Explorer</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Sign in to keep building your tech career.
          </Text>

          <View style={styles.form}>
            <TextField
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
            />
            <TextField
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} hitSlop={8}>
              <Text style={[styles.link, { color: theme.blue }]}>Forgot password?</Text>
            </TouchableOpacity>

            <GradientButton label={submitting ? 'Signing in…' : 'Sign In'} onPress={handleSignIn} />

            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textFaint }]}>or</Text>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
            </View>

            <TouchableOpacity
              onPress={handleGoogle}
              style={[styles.googleButton, { borderColor: theme.border, backgroundColor: theme.card }]}
            >
              <Text style={[styles.googleText, { color: theme.text }]}>Continue with Google (demo)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: theme.textMuted }}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
              <Text style={[styles.link, { color: theme.blue }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 48, gap: 8 },
  logo: { fontSize: 44, textAlign: 'center', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  form: { gap: 14 },
  errorText: { fontSize: 13, fontWeight: '600' },
  link: { fontSize: 13.5, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 2 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: '600' },
  googleButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: { fontSize: 14, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
