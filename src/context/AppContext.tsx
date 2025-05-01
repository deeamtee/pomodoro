import React, { createContext, useState, useEffect, useContext } from 'react';
import { Task, TimerSettings, AppSettings, TimerState, TimerMode } from '../types';
import { usePersistentTasks } from '../utils/usePersistentTasks';

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
  setCompletedCollapsed: (collapsed: boolean) => void;
  completedCollapsed: boolean;
  setShowAllCompleted: (show: boolean) => void;
  showAllCompleted: boolean;
}

interface TelegramData {
  isInTelegram: boolean;
  isDarkMode: boolean;
  themeColor: string;
  user: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  } | null;
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

const APP_SETTINGS_KEY = 'pomodoro_app_settings_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children, initialTelegramData }) => {
  const loadAppSettings = () => {
    try {
      const saved = localStorage.getItem(APP_SETTINGS_KEY);
      if (saved) {
        return { ...defaultAppSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      // ignore
    }
    return {
      ...defaultAppSettings,
      darkMode: initialTelegramData.isDarkMode,
      theme: initialTelegramData.isInTelegram ? initialTelegramData.themeColor : defaultAppSettings.theme,
    };
  };

  const [tasks, setTasks] = usePersistentTasks([]);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [appSettings, setAppSettings] = useState<AppSettings>(loadAppSettings);
  const [timerState, setTimerState] = useState<TimerState>(defaultTimerState);
  const [completedCollapsed, setCompletedCollapsed] = useState(true);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  // Save appSettings to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(appSettings));
    } catch (e) {
      // ignore
    }
  }, [appSettings]);

  // Apply dark mode class to the body (fix for browser and Telegram)
  useEffect(() => {
    if (appSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appSettings.darkMode]);

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
  }, [timerState.mode, timerSettings, timerState.isActive]);

  useEffect(() => {
    let interval: number | undefined;

    function playSoundOrVibrate() {
      if (appSettings.soundEnabled) {
        // Telegram vibration (if available)
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
          try {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          } catch (e) {
            // fallback to sound
          }
        } else if (navigator.vibrate) {
          // Browser vibration fallback
          navigator.vibrate(300);
        }
        // Always play sound in browser (if not in Telegram or vibration not available)
        const audio = new window.Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play().catch(e => console.error('Error playing sound:', e));
      }
    }

    function handleTimerComplete() {
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
        setTimerState(prev => ({
          ...prev,
          mode: 'work',
          isActive: false,
          timeRemaining: timerSettings.workMinutes * 60,
          currentSession: prev.currentSession + 1,
        }));
      }
    }

    if (timerState.isActive && timerState.timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (timerState.timeRemaining === 0) {
      playSoundOrVibrate();
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isActive, timerState.timeRemaining, timerState.mode, timerSettings, timerState.currentSession, appSettings.soundEnabled]);

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
        task.id === id 
          ? task.completed
            ? { ...task, completed: false, completed_at: undefined }
            : { ...task, completed: true, completed_at: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTimerSettings = (settings: Partial<TimerSettings>) => {
    setTimerSettings(prev => ({ ...prev, ...settings }));
  };

  const updateAppSettings = (settings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...settings }));
  };

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
    // Вынесенная внутрь skipTimer логика handleTimerComplete
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
      setTimerState(prev => ({
        ...prev,
        mode: 'work',
        isActive: false,
        timeRemaining: timerSettings.workMinutes * 60,
        currentSession: prev.currentSession + 1,
      }));
    }
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
        setCompletedCollapsed,
        completedCollapsed,
        setShowAllCompleted,
        showAllCompleted,
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