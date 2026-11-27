import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const { user, login, register, logout } = useAuth();
  const scheme = useColorScheme();
  const palette = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [isRegistering, setIsRegistering] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setMessage('');
    if (!userId.trim() || !password || (isRegistering && (!name.trim() || !confirmPassword))) {
      setMessage('Complete all required fields.');
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      setMessage('The passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      if (isRegistering) {
        await register(userId.trim(), name.trim(), password, confirmPassword);
        setIsRegistering(false);
        setPassword('');
        setConfirmPassword('');
        setMessage('Account created. Sign in with your new account.');
      } else {
        await login(userId.trim(), password);
        setPassword('');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <View style={styles.brand}>
                <View style={styles.brandMark}><ThemedText style={styles.brandMarkText}>E</ThemedText></View>
                <ThemedText type="smallBold" themeColor="textSecondary">ESEBIAL</ThemedText>
              </View>

              {user ? (
                <ThemedView type="backgroundElement" style={styles.card}>
                  <ThemedText type="smallBold" themeColor="textSecondary">YOUR ACCOUNT</ThemedText>
                  <ThemedText type="title" style={styles.heading}>Welcome back</ThemedText>
                  <ThemedText style={styles.description}>You’re signed in as {user.name}.</ThemedText>
                  <View style={styles.accountRow}>
                    <ThemedText type="small" themeColor="textSecondary">User ID</ThemedText>
                    <ThemedText type="smallBold">{user.userId}</ThemedText>
                  </View>
                  <Pressable onPress={() => void logout()} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <ThemedText type="smallBold">Sign out</ThemedText>
                  </Pressable>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.exploreNote}>Your account session is ready. Open Explore to view the app workspace.</ThemedText>
                </ThemedView>
              ) : (
                <ThemedView type="backgroundElement" style={styles.card}>
                  <ThemedText type="smallBold" themeColor="textSecondary">YOUR ACCOUNT</ThemedText>
                  <ThemedText type="title" style={styles.heading}>{isRegistering ? 'Create account' : 'Welcome back'}</ThemedText>
                  <ThemedText style={styles.description}>{isRegistering ? 'Create your Esebial account to get started.' : 'Sign in to continue to your Esebial workspace.'}</ThemedText>

                  <View style={styles.fields}>
                    <Field label="User ID" value={userId} onChangeText={setUserId} autoCapitalize="none" autoCorrect={false} palette={palette} />
                    {isRegistering && <Field label="Name" value={name} onChangeText={setName} autoCapitalize="words" palette={palette} />}
                    <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" palette={palette} />
                    {isRegistering && <Field label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" palette={palette} />}
                  </View>

                  {!!message && <ThemedText type="small" style={[styles.message, message.startsWith('Account created') ? styles.success : styles.error]}>{message}</ThemedText>}

                  <Pressable disabled={busy} onPress={() => void submit()} style={({ pressed }) => [styles.primaryButton, (pressed || busy) && styles.pressed]}>
                    {busy ? <ActivityIndicator color="#FFFFFF" /> : <ThemedText type="smallBold" style={styles.primaryText}>{isRegistering ? 'Create account' : 'Sign in'}</ThemedText>}
                  </Pressable>
                  <View style={styles.switchRow}>
                    <ThemedText type="small" themeColor="textSecondary">{isRegistering ? 'Already have an account?' : 'New to Esebial?'}</ThemedText>
                    <Pressable onPress={() => { setIsRegistering((value) => !value); setMessage(''); }}>
                      <ThemedText type="smallBold" style={styles.link}>{isRegistering ? 'Sign in' : 'Create one'}</ThemedText>
                    </Pressable>
                  </View>
                </ThemedView>
              )}
              <ThemedText type="small" themeColor="textSecondary" style={styles.footer}>Secure access to your Esebial workspace</ThemedText>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  palette: { text: string; textSecondary: string; background: string };
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}) {
  const { label, palette, ...inputProps } = props;
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        {...inputProps}
        placeholder={label}
        placeholderTextColor={palette.textSecondary}
        selectionColor="#3D63DD"
        style={[styles.input, { color: palette.text, backgroundColor: palette.background }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1, width: '100%' },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: Spacing.four, paddingVertical: Spacing.five },
  content: { width: '100%', maxWidth: 460, alignSelf: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.four },
  brandMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#3D63DD', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  card: { borderRadius: 24, padding: Spacing.four, gap: Spacing.three },
  heading: { fontSize: 34, lineHeight: 40, marginTop: Spacing.one },
  description: { color: '#6C7180', lineHeight: 23 },
  fields: { gap: Spacing.three, marginTop: Spacing.one },
  field: { gap: Spacing.two },
  input: { minHeight: 52, borderRadius: 12, paddingHorizontal: Spacing.three, fontSize: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#C9CDD6' },
  primaryButton: { minHeight: 52, borderRadius: 13, backgroundColor: '#3D63DD', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.one },
  primaryText: { color: '#FFFFFF' },
  secondaryButton: { minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: '#C9CDD6', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.two },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.one },
  link: { color: '#3D63DD' },
  message: { lineHeight: 21 },
  error: { color: '#B42318' },
  success: { color: '#16794B' },
  pressed: { opacity: 0.75 },
  footer: { textAlign: 'center', marginTop: Spacing.four },
  accountRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#C9CDD6', paddingTop: Spacing.three },
  exploreNote: { textAlign: 'center' },
});
