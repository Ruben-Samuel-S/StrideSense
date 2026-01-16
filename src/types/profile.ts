// User profile types for ProStep Monitor

export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type ProstheticSide = 'left' | 'right' | 'bilateral';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  height: number;        // cm
  weight: number;        // kg
  prostheticSide: ProstheticSide;
  activityLevel: ActivityLevel;
  createdAt: number;
  updatedAt: number;
}

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  'sedentary': 'Sedentary',
  'light': 'Lightly Active',
  'moderate': 'Moderately Active',
  'active': 'Active',
  'very-active': 'Very Active',
};

export const GENDER_LABELS: Record<Gender, string> = {
  'male': 'Male',
  'female': 'Female',
  'other': 'Other',
  'prefer-not-to-say': 'Prefer not to say',
};

export const PROSTHETIC_SIDE_LABELS: Record<ProstheticSide, string> = {
  'left': 'Left',
  'right': 'Right',
  'bilateral': 'Bilateral',
};
