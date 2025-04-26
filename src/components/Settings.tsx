import React from "react";
import { useApp } from "../context/AppContext";
import { Volume2, VolumeX, Moon, Sun } from "lucide-react";

const Settings: React.FC = () => {
  const { timerSettings, updateTimerSettings, appSettings, updateAppSettings } = useApp();

  const colorOptions = [
    "#F43F5E", // rose-500
    "#EC4899", // pink-500
    "#8B5CF6", // violet-500
    "#6366F1", // indigo-500
    "#3B82F6", // blue-500
    "#0EA5E9", // sky-500
    "#06B6D4", // cyan-500
    "#14B8A6", // teal-500
    "#10B981", // emerald-500
    "#22C55E", // green-500
    "#F59E0B", // amber-500
    "#F97316", // orange-500
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Settings</h2>

      <div className="space-y-6">
        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">Timer</h3>

          <div className="space-y-4">
            <TimerSettingSlider
              label="Focus duration"
              value={timerSettings.workMinutes}
              min={1}
              max={60}
              onChange={(value) => updateTimerSettings({ workMinutes: value })}
              themeColor={appSettings.theme}
            />

            <TimerSettingSlider
              label="Short break duration"
              value={timerSettings.shortBreakMinutes}
              min={1}
              max={30}
              onChange={(value) => updateTimerSettings({ shortBreakMinutes: value })}
              themeColor={appSettings.theme}
            />

            <TimerSettingSlider
              label="Long break duration"
              value={timerSettings.longBreakMinutes}
              min={1}
              max={60}
              onChange={(value) => updateTimerSettings({ longBreakMinutes: value })}
              themeColor={appSettings.theme}
            />

            <TimerSettingSlider
              label="Sessions before long break"
              value={timerSettings.longBreakInterval}
              min={1}
              max={10}
              onChange={(value) => updateTimerSettings({ longBreakInterval: value })}
              themeColor={appSettings.theme}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">Appearance</h3>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Theme Color</p>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => updateAppSettings({ theme: color })}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    appSettings.theme === color
                      ? "transform scale-110 shadow-md ring-2 ring-offset-2 dark:ring-offset-gray-800"
                      : ""
                  }`}
                  style={{
                    backgroundColor: color,
                    borderColor: appSettings.theme === color ? "white" : undefined,
                  }}
                  aria-label={`Set theme color to ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateAppSettings({ soundEnabled: !appSettings.soundEnabled })}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
                aria-label={appSettings.soundEnabled ? "Disable sound" : "Enable sound"}
              >
                {appSettings.soundEnabled ? (
                  <Volume2 size={18} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <VolumeX size={18} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {appSettings.soundEnabled ? "Sound on" : "Sound off"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateAppSettings({ darkMode: !appSettings.darkMode })}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
                aria-label={appSettings.darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {appSettings.darkMode ? (
                  <Sun size={18} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon size={18} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {appSettings.darkMode ? "Dark mode" : "Light mode"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TimerSettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  themeColor: string;
}

const TimerSettingSlider: React.FC<TimerSettingSliderProps> = ({ label, value, min, max, onChange, themeColor }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-sm text-gray-600 dark:text-gray-300">{label}</label>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {value} {label === "Sessions before long break" ? "sessions" : "min"}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${
            ((value - min) / (max - min)) * 100
          }%, #E5E7EB ${((value - min) / (max - min)) * 100}%, #E5E7EB 100%)`,
        }}
      />
    </div>
  );
};

export default Settings;
