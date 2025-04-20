(function(){
  // Save original console methods
  var originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };

  // Mock Telegram WebApp object if running outside of Telegram
  if (!window.Telegram || !window.Telegram.WebApp) {
    originalConsole.warn('Telegram WebApp not detected, using mock implementation for development');

    window.Telegram = {
      WebApp: {
        expand: function() {
          originalConsole.log('Telegram.WebApp.expand() called');
        },
        close: function() {
          originalConsole.log('Telegram.WebApp.close() called');
        },
        ready: function() {
          originalConsole.log('Telegram.WebApp.ready() called');
        },
        colorScheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light',
        themeParams: {
          button_color: '#F43F5E',
          button_text_color: '#FFFFFF',
          link_color: '#3B82F6',
          bg_color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? '#1F2937' 
            : '#FFFFFF',
          text_color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? '#F9FAFB' 
            : '#1F2937'
        },
        initDataUnsafe: {
          user: {
            id: 12345678,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          }
        }
      }
    };

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        window.Telegram.WebApp.colorScheme = e.matches ? 'dark' : 'light';
        window.Telegram.WebApp.themeParams.bg_color = e.matches ? '#1F2937' : '#FFFFFF';
        window.Telegram.WebApp.themeParams.text_color = e.matches ? '#F9FAFB' : '#1F2937';
      });
    }
  }
})();