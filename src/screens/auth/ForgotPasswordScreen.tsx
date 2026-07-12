import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { TextField } from '../../components/TextField';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    setError(null);
    setTempPassword(null);
    if (!email.trim()) {
      setError('Enter the email on your account.');
      return;
    }
    setSubmitting(true);
    try {
      const generated = await resetPassword(email);
      setTempPassword(generated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Reset your password</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          This build has no mail server, so a temporary password is generated for you directly instead of
          emailed.
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
          {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}
          <GradientButton label={submitting ? 'Generating…' : 'Generate Temporary Password'} onPress={handleReset} />
        </View>

        {tempPassword ? (
          <Card style={styles.resultCard}>
            <Text style={[styles.resultLabel, { color: theme.textMuted }]}>YOUR TEMPORARY PASSWORD</Text>
            <Text style={[styles.resultValue, { color: theme.blue }]}>{tempPassword}</Text>
            <Text style={[styles.resultHint, { color: theme.textFaint }]}>
              Sign in with this password, then update it from your profile.
            </Text>
          </Card>
        ) : null}

        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} style={styles.footer} hitSlop={8}>
          <Text style={[styles.link, { color: theme.blue }]}>Back to sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 64, gap: 8 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 13.5, textAlign: 'center', marginBottom: 20, lineHeight: 19 },
  form: { gap: 14 },
  errorText: { fontSize: 13, fontWeight: '600' },
  resultCard: { marginTop: 20, gap: 6, alignItems: 'center' },
  resultLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  resultValue: { fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  resultHint: { fontSize: 12, textAlign: 'center' },
  link: { fontSize: 13.5, fontWeight: '700' },
  footer: { alignItems: 'center', marginTop: 28 },
});
