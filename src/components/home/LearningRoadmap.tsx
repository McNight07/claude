import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { GradientButton } from '../GradientButton';
import { useTheme } from '../../theme/ThemeProvider';
import { RoadmapStage } from '../../types';

export function LearningRoadmap({
  stages,
  onViewRoadmap,
}: {
  stages: RoadmapStage[];
  onViewRoadmap?: () => void;
}) {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.stages}>
        {stages.map((stage, index) => {
          const color =
            stage.status === 'done'
              ? theme.teal
              : stage.status === 'active'
              ? theme.blue
              : theme.border;
          return (
            <React.Fragment key={stage.id}>
              <View style={styles.stageItem}>
                <View
                  style={[
                    styles.node,
                    {
                      backgroundColor: stage.status === 'upcoming' ? theme.cardAlt : color,
                      borderColor: color,
                    },
                  ]}
                >
                  {stage.status === 'done' ? (
                    <Feather name="check" size={14} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.nodeText,
                        { color: stage.status === 'active' ? '#FFFFFF' : theme.textFaint },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stageLabel,
                    { color: stage.status === 'upcoming' ? theme.textFaint : theme.text },
                  ]}
                >
                  {stage.label}
                </Text>
              </View>
              {index < stages.length - 1 ? (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: stage.status === 'done' ? theme.teal : theme.border },
                  ]}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
      <GradientButton label="View My Roadmap" onPress={onViewRoadmap} style={styles.button} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  stages: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stageItem: {
    alignItems: 'center',
    width: 64,
  },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  nodeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  stageLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  connector: {
    height: 2,
    flex: 1,
    marginTop: 15,
    marginHorizontal: -4,
  },
  button: {
    marginTop: 0,
  },
});
