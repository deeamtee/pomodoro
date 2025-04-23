import React, { useState, useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import CircularTimer from "./components/CircularTimer";
import TimerControls from "./components/TimerControls";
import ModeSwitcher from "./components/ModeSwitcher";
import TaskList from "./components/TaskList";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import { useApp } from "./context/AppContext";
import { initTelegramWebApp } from "./utils/telegramUtils";

// Main app with providers
function App() {
  // Initialize Telegram Web App connection once at the root level
  const telegramData = initTelegramWebApp();

  return (
    <AppProvider initialTelegramData={telegramData}>
      <AppContent />
    </AppProvider>
  );
}

// App content that can access context
const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("timer");
  const { appSettings } = useApp();

  // Apply dark mode class to the body
  useEffect(() => {
    if (appSettings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [appSettings.darkMode]);

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "timer":
        return (
          <div className="flex-1 flex flex-col items-center justify-center pb-16">
            <CircularTimer />
            <TimerControls />
            <ModeSwitcher />
          </div>
        );
      case "tasks":
        return (
          <div className="pb-20 overflow-auto">
            <TaskList />
          </div>
        );
      case "settings":
        return (
          <div className="pb-20 overflow-auto">
            <Settings />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={
        "flex flex-col justify-between h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 root"
      }
    >
      {renderTabContent()}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
