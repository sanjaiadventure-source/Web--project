/**
 * PWA Service Worker & Install Prompt Manager
 * EXPERIMENT 2d: Implement basic PWA functionality
 */

class PwaManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstallable = false;
    this.isInstalled = false;
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.listeners = [];

    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      });
    }

    // 2. Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent browser default prompt
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable = true;
      this.notify();
    });

    // 3. Track installed
    window.addEventListener('appinstalled', () => {
      this.isInstallable = false;
      this.isInstalled = true;
      this.deferredPrompt = null;
      console.log('[PWA] Application successfully installed.');
      this.notify();
    });

    // 4. Online/Offline tracking
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notify();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notify();
    });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (e) {
        console.error('PWA listener error:', e);
      }
    });
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      return { outcome: 'unavailable' };
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.isInstallable = false;
    this.notify();
    return { outcome };
  }

  getState() {
    return {
      isInstallable: this.isInstallable,
      isInstalled: this.isInstalled,
      isOnline: this.isOnline
    };
  }
}

export const pwaManager = new PwaManager();
