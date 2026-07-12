import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A tiny Firestore-shaped local database: each "collection" is a JSON map of
 * id -> document, persisted to AsyncStorage under `tce:<collection>`.
 * Swapping this module for real Firestore calls later should not require
 * touching the screens/contexts that consume it, since the method shapes
 * (getCollection/getDoc/setDoc/updateDoc/deleteDoc) mirror Firestore usage.
 */

const KEY_PREFIX = 'tce:';

async function readCollection<T>(collection: string): Promise<Record<string, T>> {
  const raw = await AsyncStorage.getItem(KEY_PREFIX + collection);
  return raw ? JSON.parse(raw) : {};
}

async function writeCollection<T>(collection: string, data: Record<string, T>): Promise<void> {
  await AsyncStorage.setItem(KEY_PREFIX + collection, JSON.stringify(data));
}

export async function getCollection<T>(collection: string): Promise<T[]> {
  const map = await readCollection<T>(collection);
  return Object.values(map);
}

export async function getDoc<T>(collection: string, id: string): Promise<T | null> {
  const map = await readCollection<T>(collection);
  return map[id] ?? null;
}

export async function setDoc<T>(collection: string, id: string, data: T): Promise<T> {
  const map = await readCollection<T>(collection);
  map[id] = data;
  await writeCollection(collection, map);
  return data;
}

export async function updateDoc<T extends object>(
  collection: string,
  id: string,
  patch: Partial<T>
): Promise<T> {
  const map = await readCollection<T>(collection);
  const existing = map[id] ?? ({} as T);
  const next = { ...existing, ...patch };
  map[id] = next;
  await writeCollection(collection, map);
  return next;
}

export async function deleteDoc(collection: string, id: string): Promise<void> {
  const map = await readCollection(collection);
  delete map[id];
  await writeCollection(collection, map);
}

export async function seedIfEmpty<T>(collection: string, seed: Record<string, T>): Promise<void> {
  const map = await readCollection<T>(collection);
  if (Object.keys(map).length === 0) {
    await writeCollection(collection, seed);
  }
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
