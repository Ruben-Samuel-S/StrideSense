/**
 * Profile Service
 * 
 * Handles user profile storage and retrieval.
 * Currently uses localStorage for MVP.
 * 
 * INTEGRATION POINT FOR BACKEND:
 * When backend is ready, replace localStorage calls with:
 * - GET /api/profile → Fetch user profile
 * - PUT /api/profile → Update user profile
 */

import { UserProfile } from '@/types/profile';

const PROFILE_STORAGE_KEY = 'prostep_profile';

export function getProfile(): UserProfile | null {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
    ...profile,
    updatedAt: Date.now(),
  }));
}

export function createProfile(data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile {
  const profile: UserProfile = {
    ...data,
    id: 'profile_' + Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveProfile(profile);
  return profile;
}

export function hasProfile(): boolean {
  return getProfile() !== null;
}
