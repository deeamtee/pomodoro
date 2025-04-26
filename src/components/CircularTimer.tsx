import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { formatTime } from "../utils/timeUtils";

interface CircularTimerProps {
  size?: number;
  strokeWidth?: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ size = 250, strokeWidth = 12 }) => {
  const { timerState, timerSettings, appSettings } = useApp();

  const totalSeconds = useMemo(() => {
    switch (timerState.mode) {
      case "work":
        return timerSettings.workMinutes * 60;
      case "shortBreak":
        return timerSettings.shortBreakMinutes * 60;
      case "longBreak":
        return timerSettings.longBreakMinutes * 60;
    }
  }, [timerState.mode, timerSettings]);

  const progress = useMemo(() => {
    return 1 - timerState.timeRemaining / totalSeconds;
  }, [timerState.timeRemaining, totalSeconds]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const { minutes, seconds } = formatTime(timerState.timeRemaining);

  const getModeLabel = () => {
    switch (timerState.mode) {
      case "work":
        return "Focus";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
        </svg>

        <svg width={size} height={size} className="absolute -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={appSettings.theme}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-linear"
            style={{
              stroke: appSettings.theme,
            }}
          />
        </svg>

        <div className="flex flex-col items-center justify-center text-center z-10">
          <span className="text-5xl font-bold tracking-tighter text-gray-800 dark:text-white">
            {minutes}:{seconds}
          </span>
          <span className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">{getModeLabel()}</span>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">Session {timerState.currentSession}</span>
        </div>
      </div>
    </div>
  );
};

export default CircularTimer;
