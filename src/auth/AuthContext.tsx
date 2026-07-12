import * as Crypto from 'expo-crypto';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCollection, getDoc, newId, setDoc, updateDoc } from '../db/localDb';
import { seedDatabase } from '../db/seed';
import { UserProfile } from '../types';

const SESSION_KEY = 'tce:session';
const USERS_COLLECTION = 'users';
const DEMO_GOOGLE_EMAIL = 'demo.google.user@techcareerexplorer.app';

interface AuthUserRecord extends UserProfile {
  passwordHash: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

function stripPassword(record: AuthUserRecord): UserProfile {
  const { passwordHash: _passwordHash, ...profile } = record;
  return profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await seedDatabase();
      const sessionUserId = await AsyncStorage.getItem(SESSION_KEY);
      if (sessionUserId) {
        const record = await getDoc<AuthUserRecord>(USERS_COLLECTION, sessionUserId);
        if (record) setUser(stripPassword(record));
      }
      setLoading(false);
    })();
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await getCollection<AuthUserRecord>(USERS_COLLECTION);
    if (existing.some((u) => u.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }
    const id = newId('user');
    const record: AuthUserRecord = {
      id,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      interests: [],
      preferredFields: [],
      createdAt: new Date().toISOString(),
    };
    await setDoc(USERS_COLLECTION, id, record);
    await AsyncStorage.setItem(SESSION_KEY, id);
    setUser(stripPassword(record));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getCollection<AuthUserRecord>(USERS_COLLECTION);
    const record = users.find((u) => u.email === normalizedEmail);
    if (!record) throw new Error('No account found with this email.');
    const passwordHash = await hashPassword(password);
    if (record.passwordHash !== passwordHash) throw new Error('Incorrect password.');
    await AsyncStorage.setItem(SESSION_KEY, record.id);
    setUser(stripPassword(record));
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Demo-only stand-in for real Google OAuth, which requires a Firebase/Google
    // Cloud project's client IDs. Signs into (or creates) a fixed demo account so
    // the flow and downstream screens are fully exercised.
    const users = await getCollection<AuthUserRecord>(USERS_COLLECTION);
    let record = users.find((u) => u.email === DEMO_GOOGLE_EMAIL);
    if (!record) {
      const id = newId('user');
      record = {
        id,
        name: 'Alex Rivera',
        email: DEMO_GOOGLE_EMAIL,
        passwordHash: await hashPassword(newId('google')),
        interests: ['Cybersecurity', 'Cloud'],
        preferredFields: ['Security', 'Cloud'],
        createdAt: new Date().toISOString(),
      };
      await setDoc(USERS_COLLECTION, record.id, record);
    }
    await AsyncStorage.setItem(SESSION_KEY, record.id);
    setUser(stripPassword(record));
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getCollection<AuthUserRecord>(USERS_COLLECTION);
    const record = users.find((u) => u.email === normalizedEmail);
    if (!record) throw new Error('No account found with this email.');
    // No real mail server in this local-first build, so the "reset" issues a
    // temporary password directly instead of emailing a link.
    const tempPassword = Math.random().toString(36).slice(2, 10);
    await updateDoc<AuthUserRecord>(USERS_COLLECTION, record.id, {
      passwordHash: await hashPassword(tempPassword),
    });
    return tempPassword;
  }, []);

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      updateDoc<AuthUserRecord>(USERS_COLLECTION, current.id, patch as Partial<AuthUserRecord>);
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signUp, signIn, signInWithGoogle, signOut, resetPassword, updateProfile }),
    [user, loading, signUp, signIn, signInWithGoogle, signOut, resetPassword, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
