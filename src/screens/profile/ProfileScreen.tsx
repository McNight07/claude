import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../auth/AuthContext';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { useAppData } from '../../context/AppDataContext';
import { useAppNavigation } from '../../navigation/useAppNavigation';
import { useTheme } from '../../theme/ThemeProvider';

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useAppNavigation();
  const { user, signOut } = useAuth();
  const { favorites, bookmarks, certProgress, quizResults } = useAppData();

  if (!user) return null;

  const completedCerts = certProgress.filter((c) => c.progress >= 1).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          {user.photoUri ? (
            <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
          ) : (
            <LinearGradient colors={theme.gradientPrimary} style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </LinearGradient>
          )}
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
            <Text style={[styles.email, { color: theme.textMuted }]}>{user.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editButton, { borderColor: theme.border, backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Feather name="edit-2" size={14} color={theme.text} />
          <Text style={[styles.editButtonText, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.statGrid}>
          <StatTile label="Favorites" value={String(favorites.length)} theme={theme} />
          <StatTile label="Bookmarks" value={String(bookmarks.length)} theme={theme} />
          <StatTile label="Certs earned" value={String(completedCerts)} theme={theme} />
          <StatTile label="Quizzes taken" value={String(quizResults.length)} theme={theme} />
        </View>

        {user.experienceLevel ? (
          <InfoRow label="Experience level" theme={theme}>
            <Pill label={user.experienceLevel} color={theme.blue} />
          </InfoRow>
        ) : null}

        {user.interests.length > 0 ? (
          <InfoRow label="Interests" theme={theme}>
            <View style={styles.chipWrap}>
              {user.interests.map((i) => (
                <Pill key={i} label={i} color={theme.purple} />
              ))}
            </View>
          </InfoRow>
        ) : null}

        {user.preferredFields.length > 0 ? (
          <InfoRow label="Preferred fields" theme={theme}>
            <View style={styles.chipWrap}>
              {user.preferredFields.map((f) => (
                <Pill key={f} label={f} color={theme.teal} />
              ))}
            </View>
          </InfoRow>
        ) : null}

        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: theme.danger }]}
          onPress={() => signOut()}
        >
          <Feather name="log-out" size={16} color={theme.danger} />
          <Text style={[styles.signOutText, { color: theme.danger }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatTile({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <Card style={styles.statTile}>
      <Text style={[styles.statValue, { color: theme.blue }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
    </Card>
  );
}

function InfoRow({ label, theme, children }: { label: string; theme: ReturnType<typeof useTheme>; children: React.ReactNode }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.textMuted }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, gap: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 64, height: 64, borderRadius: 32 },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  headerInfo: { flex: 1 },
  name: { fontSize: 19, fontWeight: '800' },
  email: { fontSize: 13, marginTop: 2 },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  editButtonText: { fontSize: 13.5, fontWeight: '700' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statTile: { width: '47%', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600' },
  infoRow: { gap: 8 },
  infoLabel: { fontSize: 11.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    marginTop: 8,
  },
  signOutText: { fontSize: 14, fontWeight: '700' },
});
