
export interface UserStats {
  steps: number;
  waterIntake: number; // in ml
  caloriesBurned: number;
  heartRate: number;
  distance: number; // in km
  sleepHours: number;
}

export interface ActivityData {
  time: string;
  steps: number;
  calories: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum Tab {
  DASHBOARD = 'dashboard',
  TRACKER = 'tracker',
  AI_COACH = 'coach',
  PROFILE = 'profile'
}
