import { Telegram } from "@twa-dev/types";

/**
 * Initialize Telegram WebApp
 */
export const initTelegramWebApp = () => {
  // Check if we're running in Telegram WebApp environment
  if (window.Telegram && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // Expand the WebApp to full height
    webApp.ready()
    // webApp.expand();
    webApp.requestFullscreen();
    
    // Set the theme based on Telegram's color scheme
    const isThemeDark = webApp.colorScheme === 'dark';
    
    // Get Telegram's accent color if available
    const themeColor = webApp.themeParams?.button_color || '#F43F5E';
    
    return {
      isInTelegram: true,
      isDarkMode: isThemeDark,
      themeColor,
      user: webApp.initDataUnsafe?.user,
    };
  }
  
  return {
    isInTelegram: false,
    isDarkMode: false,
    themeColor: '#F43F5E',
    user: null,
  };
};

declare global {
  interface Window {
    Telegram: Telegram;
  }
}