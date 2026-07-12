import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '../../components/GradientButton';
import { useAppData } from '../../context/AppDataContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { Career } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Compare'>;

function formatSalary(value: number) {
  return `$${Math.round(value / 1000)}k`;
}

function buildComparisonHtml(careers: Career[]): string {
  const rows: [string, (c: Career) => string][] = [
    ['Salary (entry–senior)', (c) => `${formatSalary(c.salary.entry)} – ${formatSalary(c.salary.senior)}`],
    ['Job Growth', (c) => c.jobOutlook],
    ['Demand', (c) => c.demand],
    ['Education', (c) => c.educationRequired],
    ['Difficulty', (c) => c.difficulty],
    ['Remote Opportunities', (c) => (c.remote ? 'Yes' : 'Limited')],
    ['Required Skills', (c) => c.skillsRequired.join(', ')],
  ];
  const header = careers.map((c) => `<th>${c.icon} ${c.title}</th>`).join('');
  const body = rows
    .map(
      ([label, get]) =>
        `<tr><td class="label">${label}</td>${careers.map((c) => `<td>${get(c)}</td>`).join('')}</tr>`
    )
    .join('');
  return `
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px;">
        <h1 style="font-size: 20px;">Tech Career Explorer — Career Comparison</h1>
        <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
          <thead><tr><th></th>${header}</tr></thead>
          <tbody>${body}</tbody>
        </table>
        <style>
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 13px; vertical-align: top; }
          th { background: #f3f4f6; }
          td.label { font-weight: 700; background: #fafafa; white-space: nowrap; }
        </style>
      </body>
    </html>
  `;
}

export function CompareScreen({ navigation }: Props) {
  const theme = useTheme();
  const { careers, compareIds, toggleCompare, clearCompare } = useAppData();
  const selected = careers.filter((c) => compareIds.includes(c.id));

  const handleExportPdf = async () => {
    const html = buildComparisonHtml(selected);
    if (Platform.OS === 'web') {
      await Print.printAsync({ html });
      return;
    }
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Compare Careers</Text>
        <TouchableOpacity onPress={clearCompare} hitSlop={10}>
          <Text style={[styles.clearText, { color: theme.danger }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {selected.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: theme.textMuted, textAlign: 'center' }}>
            Add careers to compare from Explore Careers or a career's detail page.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
            <View>
              <View style={styles.row}>
                <View style={styles.labelCell} />
                {selected.map((career) => (
                  <View key={career.id} style={styles.headerCell}>
                    <TouchableOpacity onPress={() => toggleCompare(career.id)} style={styles.removeButton} hitSlop={8}>
                      <Feather name="x" size={12} color={theme.textFaint} />
                    </TouchableOpacity>
                    <Text style={styles.headerIcon}>{career.icon}</Text>
                    <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={2}>
                      {career.title}
                    </Text>
                  </View>
                ))}
              </View>

              <CompareRow label="Salary" theme={theme}>
                {selected.map((c) => (
                  <Text key={c.id} style={[styles.cellValue, { color: theme.blue }]}>
                    {formatSalary(c.salary.entry)}–{formatSalary(c.salary.senior)}
                  </Text>
                ))}
              </CompareRow>
              <CompareRow label="Job Growth" theme={theme}>
                {selected.map((c) => (
                  <Text key={c.id} style={[styles.cellValue, { color: theme.text }]}>
                    {c.jobOutlook}
                  </Text>
                ))}
              </CompareRow>
              <CompareRow label="Demand" theme={theme}>
                {selected.map((c) => (
                  <Text key={c.id} style={[styles.cellValue, { color: theme.text }]}>
                    {c.demand}
                  </Text>
                ))}
              </CompareRow>
              <CompareRow label="Difficulty" theme={theme}>
                {selected.map((c) => (
                  <Text key={c.id} style={[styles.cellValue, { color: theme.text }]}>
                    {c.difficulty}
                  </Text>
                ))}
              </CompareRow>
              <CompareRow label="Education" theme={theme}>
                {selected.map((c) => (
                  <Text key={c.id} style={[styles.cellValue, { color: theme.text }]}>
                    {c.educationRequired}
                  </Text>
                ))}
              </CompareRow>
              <CompareRow label="Remote" theme={theme}>
                {selected.map((c) => (
                  <Text key={c.id} style={[styles.cellValue, { color: theme.text }]}>
                    {c.remote ? 'Yes' : 'Limited'}
                  </Text>
                ))}
              </CompareRow>
              <CompareRow label="Certifications" theme={theme}>
                {selected.map((c) => (
                  <Text key={c.id} style={[styles.cellValue, { color: theme.text }]}>
                    {c.certificationIds.length || '—'}
                  </Text>
                ))}
              </CompareRow>
              <CompareRow label="Key Skills" theme={theme}>
                {selected.map((c) => (
                  <Text key={c.id} style={[styles.cellValue, { color: theme.text }]}>
                    {c.skillsRequired.slice(0, 3).join(', ')}
                  </Text>
                ))}
              </CompareRow>
            </View>
          </ScrollView>

          <GradientButton label="Export as PDF" onPress={handleExportPdf} style={styles.exportButton} />
        </>
      )}
    </SafeAreaView>
  );
}

function CompareRow({
  label,
  theme,
  children,
}: {
  label: string;
  theme: ReturnType<typeof useTheme>;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.row, { borderTopColor: theme.border }]}>
      <View style={styles.labelCell}>
        <Text style={[styles.labelText, { color: theme.textMuted }]}>{label}</Text>
      </View>
      {React.Children.map(children, (child) => (
        <View style={styles.dataCell}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  title: { fontSize: 17, fontWeight: '700' },
  clearText: { fontSize: 13, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  tableScroll: { flexGrow: 0, paddingHorizontal: 20 },
  row: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 10 },
  labelCell: { width: 110, justifyContent: 'center' },
  labelText: { fontSize: 12, fontWeight: '700' },
  headerCell: { width: 120, alignItems: 'center', gap: 4 },
  removeButton: { alignSelf: 'flex-end' },
  headerIcon: { fontSize: 22 },
  headerTitle: { fontSize: 12.5, fontWeight: '700', textAlign: 'center' },
  dataCell: { width: 120, paddingHorizontal: 6, justifyContent: 'center' },
  cellValue: { fontSize: 12.5, lineHeight: 17 },
  exportButton: { margin: 20, marginTop: 12 },
});
