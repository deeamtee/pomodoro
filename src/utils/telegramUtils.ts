import { Telegram, WebApp } from "@twa-dev/types";

const getPlatform = (webApp: WebApp) => {
 if (webApp.platform === 'android' || webApp.platform === 'ios') {
   return 'mobile';
 } else {
   return 'desktop';
 }
}

export const initTelegramWebApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    webApp.ready()
    webApp.expand();

    if (getPlatform(webApp) === 'mobile' && webApp.requestFullscreen) {
      const version = parseInt(webApp.version);
      if (version >= 7.7) {
        webApp.disableVerticalSwipes();
      }

      if (version >= 8) {
        webApp.requestFullscreen();
        webApp.lockOrientation();
      }
    }
    
    const isThemeDark = webApp.colorScheme === 'dark';
    
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