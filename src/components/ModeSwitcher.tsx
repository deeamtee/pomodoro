import React from "react";
import { useApp } from "../context/AppContext";
import { TimerMode } from "../types";

const ModeSwitcher: React.FC = () => {
  const { timerState, setTimerMode, appSettings } = useApp();

  const handleModeChange = (mode: TimerMode) => {
    setTimerMode(mode);
  };

  return (
    <div className="flex justify-center mt-6 space-x-2 text-sm">
      {["work", "shortBreak", "longBreak"].map((mode) => (
        <button
          key={mode}
          onClick={() => handleModeChange(mode as TimerMode)}
          className={`py-2 px-4 rounded-full transition-colors ${
            timerState.mode === mode
              ? "bg-opacity-90 text-white"
              : "bg-gray-200 bg-opacity-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
          style={{
            backgroundColor: timerState.mode === mode ? appSettings.theme : undefined,
          }}
        >
          {mode === "work" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"}
        </button>
      ))}
    </div>
  );
};

export default ModeSwitcher;
