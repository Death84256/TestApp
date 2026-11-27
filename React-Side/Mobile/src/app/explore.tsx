import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { API_BASE_URL } from '@/auth/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type Health = { status: string; backendReachable: boolean; backendStatus?: number };

export default function WorkspaceScreen() {
  const [health, setHealth] = useState<Health | null>(null);
  const [checking, setChecking] = useState(false);

  async function checkConnection() {
    setChecking(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      const result = await response.json();
      setHealth(result);
    } catch {
      setHealth({ status: 'error', backendReachable: false });
    } finally {
      clearTimeout(timeout);
      setChecking(false);
    }
  }

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.content}>
        <ThemedText type="smallBold" themeColor="textSecondary">ESEBIAL MOBILE</ThemedText>
        <ThemedText type="title" style={styles.heading}>Workspace</ThemedText>
        <ThemedText style={styles.description}>The mobile app connects to the C# account API through the Express gateway running on your development PC.</ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Backend connection</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">Gateway: {API_BASE_URL}</ThemedText>
          {health && (
            <ThemedText type="small" style={{ color: health.backendReachable ? '#16794B' : '#B42318' }}>
              {health.backendReachable
                ? `Connected to C# API (HTTP ${health.backendStatus ?? 'ok'}).`
                : 'Could not reach the C# API. Check both services and your Wi-Fi connection.'}
            </ThemedText>
          )}
          <Pressable disabled={checking} onPress={() => void checkConnection()} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            {checking ? <ActivityIndicator color="#FFFFFF" /> : <ThemedText type="smallBold" style={styles.buttonText}>Check connection</ThemedText>}
          </Pressable>
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: Spacing.four },
  content: { width: '100%', maxWidth: 700, alignSelf: 'center', gap: Spacing.three },
  heading: { fontSize: 38, lineHeight: 44 },
  description: { lineHeight: 24, maxWidth: 540 },
  card: { borderRadius: 20, padding: Spacing.four, gap: Spacing.three, marginTop: Spacing.two },
  cardTitle: { fontSize: 23, lineHeight: 30 },
  button: { minHeight: 48, borderRadius: 12, backgroundColor: '#3D63DD', justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFFFFF' },
  pressed: { opacity: 0.75 },
});
