/**
 * Settings Panel Component
 * Theme, language, and app settings
 */

import { useState } from 'react';
import { type ThemeMode, THEME_INFO } from '../services/themeService';
import { type SupportedLanguage, SUPPORTED_LANGUAGES } from '../services/languageService';
import { resetOnboarding } from '../services/onboardingService';
import { getNotificationPermission, requestNotificationPermission, areNotificationsSupported } from '../services/notificationService';
import { getCookingStats, getAchievements, clearCookingHistory } from '../services/cookingHistory';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onShowOnboarding: () => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  onShowOnboarding,
}: SettingsPanelProps) {
  const [showStats, setShowStats] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(getNotificationPermission());

  if (!isOpen) return null;

  const stats = getCookingStats();
  const achievements = getAchievements(stats);
  const earnedAchievements = achievements.filter(a => a.earned);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationStatus(granted ? 'granted' : 'denied');
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all cooking history? This cannot be undone.')) {
      clearCookingHistory();
      setShowStats(false);
    }
  };

  const handleResetTutorial = () => {
    resetOnboarding();
    onShowOnboarding();
    onClose();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button onClick={onClose} className="btn-close-settings">✕</button>
        </div>

        <div className="settings-content">
          {/* Theme Section */}
          <div className="settings-section">
            <h3>{THEME_INFO[theme].icon} Theme</h3>
            <div className="theme-options">
              {(['light', 'dark', 'high-contrast'] as ThemeMode[]).map(t => (
                <button
                  key={t}
                  onClick={() => onThemeChange(t)}
                  className={`btn-theme-option ${theme === t ? 'active' : ''}`}
                >
                  <span className="theme-icon">{THEME_INFO[t].icon}</span>
                  <span className="theme-label">{THEME_INFO[t].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Section */}
          <div className="settings-section">
            <h3>🌍 Language</h3>
            <div className="language-options">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`btn-language-option ${language === lang.code ? 'active' : ''}`}
                >
                  <span className="language-flag">{lang.flag}</span>
                  <span className="language-name">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Section */}
          {areNotificationsSupported() && (
            <div className="settings-section">
              <h3>🔔 Notifications</h3>
              {notificationStatus === 'granted' ? (
                <p className="notification-status success">✓ Notifications enabled</p>
              ) : notificationStatus === 'denied' ? (
                <p className="notification-status denied">✕ Notifications blocked (change in browser settings)</p>
              ) : (
                <button onClick={handleEnableNotifications} className="btn-enable-notifications">
                  Enable Timer Notifications
                </button>
              )}
            </div>
          )}

          {/* Tutorial Section */}
          <div className="settings-section">
            <h3>📖 Tutorial</h3>
            <button onClick={handleResetTutorial} className="btn-show-tutorial">
              Show Tutorial Again
            </button>
          </div>

          {/* Stats Section */}
          <div className="settings-section">
            <h3>📊 Cooking Stats</h3>
            <button onClick={() => setShowStats(!showStats)} className="btn-show-stats">
              {showStats ? 'Hide Stats' : 'View My Stats'}
            </button>
            
            {showStats && (
              <div className="stats-panel">
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{stats.totalRecipesCooked}</span>
                    <span className="stat-label">Recipes Cooked</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.uniqueRecipes}</span>
                    <span className="stat-label">Unique Recipes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.streakDays}</span>
                    <span className="stat-label">Day Streak</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.averageRating.toFixed(1)}⭐</span>
                    <span className="stat-label">Avg Rating</span>
                  </div>
                </div>

                {earnedAchievements.length > 0 && (
                  <div className="achievements-section">
                    <h4>🏆 Achievements</h4>
                    <div className="achievements-grid">
                      {earnedAchievements.map((achievement, i) => (
                        <div key={i} className="achievement-badge">
                          <span className="achievement-icon">{achievement.icon}</span>
                          <span className="achievement-title">{achievement.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={handleClearHistory} className="btn-clear-history">
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <p className="app-version">Easy Recipe Helper v1.0</p>
        </div>
      </div>
    </div>
  );
}
