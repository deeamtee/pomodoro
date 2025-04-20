import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TimerSettings, AppSettings, TimerState, TimerMode } from '../types';

interface AppContextType {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  timerSettings: TimerSettings;
  updateTimerSettings: (settings: Partial<TimerSettings>) => void;
  appSettings: AppSettings;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  timerState: TimerState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
}

interface TelegramData {
  isInTelegram: boolean;
  isDarkMode: boolean;
  themeColor: string;
  user: any;
}

interface AppProviderProps {
  children: React.ReactNode;
  initialTelegramData: TelegramData;
}

const defaultTimerSettings: TimerSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

const defaultAppSettings: AppSettings = {
  theme: '#F43F5E', // Default - rose color
  soundEnabled: true,
  darkMode: false,
};

const defaultTimerState: TimerState = {
  mode: 'work',
  timeRemaining: defaultTimerSettings.workMinutes * 60,
  isActive: false,
  currentSession: 1,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children, initialTelegramData }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [appSettings, setAppSettings] = useState<AppSettings>(() => ({
    ...defaultAppSettings,
    darkMode: initialTelegramData.isDarkMode,
    theme: initialTelegramData.isInTelegram ? initialTelegramData.themeColor : defaultAppSettings.theme,
  }));
  const [timerState, setTimerState] = useState<TimerState>(defaultTimerState);

  // Initialize timer based on settings
  useEffect(() => {
    const getTimeForCurrentMode = () => {
      switch (timerState.mode) {
        case 'work':
          return timerSettings.workMinutes * 60;
        case 'shortBreak':
          return timerSettings.shortBreakMinutes * 60;
        case 'longBreak':
          return timerSettings.longBreakMinutes * 60;
      }
    };

    if (!timerState.isActive) {
      setTimerState(prev => ({
        ...prev,
        timeRemaining: getTimeForCurrentMode(),
      }));
    }
  }, [timerState.mode, timerSettings]);

  // Timer countdown logic
  useEffect(() => {
    let interval: number | undefined;

    if (timerState.isActive && timerState.timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (timerState.timeRemaining === 0) {
      playSound();
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isActive, timerState.timeRemaining]);

  // Play sound when timer completes
  const playSound = () => {
    if (appSettings.soundEnabled) {
      // Play notification sound
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
      audio.play().catch(e => console.error('Error playing sound:', e));
    }
  };

  // Handle timer completion and cycle to next mode
  const handleTimerComplete = () => {
    if (timerState.mode === 'work') {
      const isLongBreakDue = timerState.currentSession % timerSettings.longBreakInterval === 0;
      setTimerState(prev => ({
        ...prev,
        mode: isLongBreakDue ? 'longBreak' : 'shortBreak',
        isActive: false,
        timeRemaining: isLongBreakDue 
          ? timerSettings.longBreakMinutes * 60 
          : timerSettings.shortBreakMinutes * 60,
      }));
    } else {
      // After break, go back to work mode and increment session
      setTimerState(prev => ({
        ...prev,
        mode: 'work',
        isActive: false,
        timeRemaining: timerSettings.workMinutes * 60,
        currentSession: prev.currentSession + 1,
      }));
    }
  };

  // Task management
  const addTask = (title: string) => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Timer settings
  const updateTimerSettings = (settings: Partial<TimerSettings>) => {
    setTimerSettings(prev => ({ ...prev, ...settings }));
  };

  // App settings
  const updateAppSettings = (settings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...settings }));
  };

  // Timer controls
  const startTimer = () => {
    setTimerState(prev => ({ ...prev, isActive: true }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isActive: false }));
  };

  const resetTimer = () => {
    const timeForCurrentMode = 
      timerState.mode === 'work' 
        ? timerSettings.workMinutes * 60 
        : timerState.mode === 'shortBreak'
          ? timerSettings.shortBreakMinutes * 60
          : timerSettings.longBreakMinutes * 60;

    setTimerState(prev => ({
      ...prev,
      isActive: false,
      timeRemaining: timeForCurrentMode,
    }));
  };

  const skipTimer = () => {
    handleTimerComplete();
  };

  const setTimerMode = (mode: TimerMode) => {
    const timeForMode = 
      mode === 'work' 
        ? timerSettings.workMinutes * 60 
        : mode === 'shortBreak'
          ? timerSettings.shortBreakMinutes * 60
          : timerSettings.longBreakMinutes * 60;

    setTimerState(prev => ({
      ...prev,
      mode,
      isActive: false,
      timeRemaining: timeForMode,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        addTask,
        toggleTaskCompletion,
        deleteTask,
        timerSettings,
        updateTimerSettings,
        appSettings,
        updateAppSettings,
        timerState,
        startTimer,
        pauseTimer,
        resetTimer,
        skipTimer,
        setTimerMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};