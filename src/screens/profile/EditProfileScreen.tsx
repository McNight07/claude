import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../auth/AuthContext';
import { FilterChip } from '../../components/FilterChip';
import { GradientButton } from '../../components/GradientButton';
import { TextField } from '../../components/TextField';
import { useAppData } from '../../context/AppDataContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { Difficulty } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const experienceLevels: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const interestOptions = ['Cybersecurity', 'Cloud', 'Networking', 'Programming', 'Data', 'AI/ML', 'Design', 'DevOps'];

export function EditProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const { careers } = useAppData();
  const fieldOptions = useMemo(() => Array.from(new Set(careers.map((c) => c.industry))).sort(), [careers]);

  const [name, setName] = useState(user?.name ?? '');
  const [photoUri, setPhotoUri] = useState(user?.photoUri);
  const [experienceLevel, setExperienceLevel] = useState<Difficulty | undefined>(user?.experienceLevel);
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [preferredFields, setPreferredFields] = useState<string[]>(user?.preferredFields ?? []);
  const [saving, setSaving] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() || user?.name, photoUri, experienceLevel, interests, preferredFields });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={handlePickPhoto} style={styles.photoWrap}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <LinearGradient colors={theme.gradientPrimary} style={styles.photo}>
              <Text style={styles.photoInitial}>{(name || 'U').charAt(0).toUpperCase()}</Text>
            </LinearGradient>
          )}
          <View style={[styles.photoBadge, { backgroundColor: theme.blue }]}>
            <Feather name="camera" size={12} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TextField label="Full name" value={name} onChangeText={setName} placeholder="Your name" />

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Experience level</Text>
          <View style={styles.chipRow}>
            {experienceLevels.map((level) => (
              <FilterChip
                key={level}
                label={level}
                selected={experienceLevel === level}
                onPress={() => setExperienceLevel(level)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Interests</Text>
          <View style={styles.chipRow}>
            {interestOptions.map((option) => (
              <FilterChip
                key={option}
                label={option}
                selected={interests.includes(option)}
                onPress={() => toggle(interests, setInterests, option)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Preferred fields</Text>
          <View style={styles.chipRow}>
            {fieldOptions.map((option) => (
              <FilterChip
                key={option}
                label={option}
                selected={preferredFields.includes(option)}
                onPress={() => toggle(preferredFields, setPreferredFields, option)}
              />
            ))}
          </View>
        </View>

        <GradientButton label={saving ? 'Saving…' : 'Save Changes'} onPress={handleSave} style={styles.saveButton} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8 },
  title: { fontSize: 17, fontWeight: '700' },
  content: { padding: 20, paddingTop: 4, gap: 20 },
  photoWrap: { alignSelf: 'center', marginBottom: 4 },
  photo: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  photoInitial: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  photoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  section: { gap: 8 },
  sectionLabel: { fontSize: 11.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  saveButton: { marginTop: 8 },
});
