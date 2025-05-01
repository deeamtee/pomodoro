import React, { useState, useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import CircularTimer from "./components/CircularTimer";
import TimerControls from "./components/TimerControls";
import ModeSwitcher from "./components/ModeSwitcher";
import TaskList from "./components/TaskList";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import { useApp } from "./context/AppContext";
import { useTelegram } from "./utils/useTelegram";

// Main app with providers
function App() {
  const telegramData = useTelegram();

  return (
    <AppProvider initialTelegramData={telegramData}>
      <AppContent />
    </AppProvider>
  );
}

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("timer");
  const { appSettings } = useApp();

  useEffect(() => {
    if (appSettings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [appSettings.darkMode]);


  const TabContent = () => {
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
          <div className="pb-20 pt-4 h-full overflow-scroll no-scrollbar flex flex-col">
            <TaskList />
          </div>
        );
      case "settings":
        return (
          <div className="pb-20 pt-4 h-full overflow-scroll no-scrollbar flex flex-col">
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
        "flex flex-col h-screen justify-between bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 root"
      }
    >
      <TabContent/>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
