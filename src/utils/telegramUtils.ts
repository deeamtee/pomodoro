/**
 * Initialize Telegram WebApp
 */
export const initTelegramWebApp = () => {
  // Check if we're running in Telegram WebApp environment
  if (window.Telegram && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // Expand the WebApp to full height
    webApp.expand();
    
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

// Add Telegram WebApp typings
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        expand: () => void;
        close: () => void;
        ready: () => void;
        colorScheme: 'light' | 'dark';
        themeParams?: {
          button_color?: string;
          button_text_color?: string;
          link_color?: string;
          bg_color?: string;
          text_color?: string;
        };
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}