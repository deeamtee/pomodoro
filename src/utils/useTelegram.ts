import { useEffect, useState } from 'react';
import { WebApp } from "@twa-dev/types";

export interface TelegramData {
  isInTelegram: boolean;
  isDarkMode: boolean;
  themeColor: string;
  user: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  } | null;
}

const getPlatform = (webApp: WebApp) => {
  if (webApp.platform === 'android' || webApp.platform === 'ios') {
    return 'mobile';
  } else {
    return 'desktop';
  }
};

export function useTelegram(): TelegramData {
  const [telegramData, setTelegramData] = useState<TelegramData>({
    isInTelegram: false,
    isDarkMode: false,
    themeColor: '#F43F5E',
    user: null,
  });

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
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
      setTelegramData({
        isInTelegram: true,
        isDarkMode: isThemeDark,
        themeColor,
        user: webApp.initDataUnsafe?.user || null,
      });
    }
  }, []);

  return telegramData;
}
