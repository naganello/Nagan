export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  date: string; // ISO string
  name: string;
  exercises: Exercise[];
  totalVolume: number; // Calculated helper
}

export enum Goal {
  HYPERTROPHY = 'Ipertrofia (Massa)',
  STRENGTH = 'Forza',
  ENDURANCE = 'Resistenza',
  WEIGHT_LOSS = 'Perdita Peso'
}

export enum Level {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzato'
}

export interface AIPlanRequest {
  goal: Goal;
  level: Level;
  daysPerWeek: number;
  equipment: string;
}

export interface AIPlanDay {
  dayName: string;
  focus: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    notes?: string;
  }[];
}

export interface AIPlanResponse {
  planName: string;
  description: string;
  schedule: AIPlanDay[];
}

// --- Challenges & Nutrition ---

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string; // e.g., 'km', 'sessioni', 'kg'
  completed: boolean;
  type: 'distance' | 'frequency' | 'volume';
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string; // ISO String (YYYY-MM-DD format usually)
}

export interface DailyNutrition {
  date: string;
  meals: Meal[];
}

// --- User Management ---

export interface UserProfile {
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  gender?: 'M' | 'F' | 'Other';
}

export interface User {
  id: string;
  username: string; // usato per il login
  password?: string; // simulazione auth
  name: string;
  profile: UserProfile;
}