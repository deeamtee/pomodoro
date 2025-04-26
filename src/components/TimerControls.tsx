import React from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { useApp } from "../context/AppContext";

const TimerControls: React.FC = () => {
  const { timerState, startTimer, pauseTimer, resetTimer, skipTimer, appSettings } = useApp();

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      {/* Reset button */}
      <button
        onClick={resetTimer}
        className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 
                  dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 
                  transition-colors"
        aria-label="Reset timer"
      >
        <RotateCcw size={20} />
      </button>

      {/* Play/Pause button */}
      <button
        onClick={timerState.isActive ? pauseTimer : startTimer}
        className="p-5 rounded-full shadow-lg transition-colors"
        style={{
          backgroundColor: appSettings.theme,
          color: "white",
        }}
        aria-label={timerState.isActive ? "Pause timer" : "Start timer"}
      >
        {timerState.isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
      </button>

      {/* Skip button */}
      <button
        onClick={skipTimer}
        className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 
                  dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 
                  transition-colors"
        aria-label="Skip to next session"
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
};

export default TimerControls;
