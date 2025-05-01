export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completed_at?: Date;
}

export interface TimerSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

export interface AppSettings {
  theme: string;
  soundEnabled: boolean;
  darkMode: boolean;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeRemaining: number;
  isActive: boolean;
  currentSession: number;
}