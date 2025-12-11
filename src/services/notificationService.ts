/**
 * Notification Service
 * Smart reminders and push notifications for cooking
 */

const NOTIFICATION_PERMISSION_KEY = 'recipe_app_notifications';

/**
 * Check if notifications are supported
 */
export function areNotificationsSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Check current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!areNotificationsSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!areNotificationsSupported()) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
}

/**
 * Show a notification
 */
export function showNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    requireInteraction?: boolean;
    vibrate?: number[];
  }
): Notification | null {
  if (!areNotificationsSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      body: options?.body,
      icon: options?.icon || '/icons/icon-192x192.png',
      tag: options?.tag,
      requireInteraction: options?.requireInteraction || false,
    });

    return notification;
  } catch (error) {
    console.error('Failed to show notification:', error);
    return null;
  }
}

/**
 * Timer notification
 */
export function showTimerDoneNotification(recipeName?: string): Notification | null {
  return showNotification('⏰ Timer Done!', {
    body: recipeName 
      ? `Time to check your ${recipeName}!` 
      : 'Time to check on your cooking!',
    tag: 'timer-done',
    requireInteraction: true,
    vibrate: [300, 100, 300, 100, 300],
  });
}

/**
 * Timer warning notification (1 minute left)
 */
export function showTimerWarningNotification(minutesLeft: number): Notification | null {
  return showNotification('⏱️ Almost Done!', {
    body: `${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} left on your timer`,
    tag: 'timer-warning',
    vibrate: [200],
  });
}

/**
 * Cooking reminder notification
 */
export function showCookingReminderNotification(stepDescription?: string): Notification | null {
  return showNotification('👨‍🍳 Don\'t Forget!', {
    body: stepDescription || 'Check on your cooking!',
    tag: 'cooking-reminder',
  });
}

/**
 * Achievement notification
 */
export function showAchievementNotification(achievement: string, icon: string): Notification | null {
  return showNotification(`${icon} Achievement Unlocked!`, {
    body: achievement,
    tag: 'achievement',
    vibrate: [100, 50, 100, 50, 200],
  });
}

/**
 * Play notification sound using Web Audio API
 */
export function playNotificationSound(type: 'timer' | 'warning' | 'success' = 'timer'): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'timer':
        // Urgent beeping
        oscillator.frequency.value = 880;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        // Beep pattern
        for (let i = 0; i < 5; i++) {
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.4);
          gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 0.4 + 0.2);
        }
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
        break;

      case 'warning':
        // Single soft tone
        oscillator.frequency.value = 523;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;

      case 'success':
        // Happy ascending tones
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
    }
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
}

/**
 * Vibrate device if supported
 */
export function vibrateDevice(pattern: number | number[] = [200, 100, 200]): void {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      // Vibration not supported or blocked
    }
  }
}

/**
 * Schedule a reminder (uses setTimeout for now)
 * In a full implementation, this could use the Notification Triggers API
 */
export function scheduleReminder(
  delayMs: number,
  callback: () => void
): { cancel: () => void } {
  const timeoutId = setTimeout(callback, delayMs);
  return {
    cancel: () => clearTimeout(timeoutId),
  };
}

/**
 * Check if we should show notification permission prompt
 */
export function shouldPromptForNotifications(): boolean {
  if (!areNotificationsSupported()) return false;
  if (Notification.permission === 'granted') return false;
  if (Notification.permission === 'denied') return false;
  
  // Check if we've already prompted
  try {
    const prompted = localStorage.getItem(NOTIFICATION_PERMISSION_KEY);
    return prompted !== 'prompted';
  } catch {
    return true;
  }
}

/**
 * Mark that we've prompted for notifications
 */
export function markNotificationPromptShown(): void {
  try {
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'prompted');
  } catch {
    // Ignore storage errors
  }
}
