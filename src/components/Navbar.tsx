import React from 'react';
import { Timer, CheckSquare, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const { appSettings } = useApp();
  
  return (
    <div className="border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 z-10">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around">
          <NavButton 
            icon={<Timer size={20} />} 
            label="Timer" 
            isActive={activeTab === 'timer'} 
            onClick={() => onTabChange('timer')}
            themeColor={appSettings.theme}
          />
          <NavButton 
            icon={<CheckSquare size={20} />} 
            label="Tasks" 
            isActive={activeTab === 'tasks'} 
            onClick={() => onTabChange('tasks')}
            themeColor={appSettings.theme}
          />
          <NavButton 
            icon={<Settings size={20} />} 
            label="Settings" 
            isActive={activeTab === 'settings'} 
            onClick={() => onTabChange('settings')}
            themeColor={appSettings.theme}
          />
        </div>
      </div>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  themeColor: string;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick, themeColor }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-3 w-full transition-colors ${
        isActive ? 'text-opacity-100' : 'text-gray-500 dark:text-gray-400'
      }`}
      style={{ color: isActive ? themeColor : undefined }}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default Navbar;