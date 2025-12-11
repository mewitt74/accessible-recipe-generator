/**
 * Keyboard Shortcuts Help Component
 * Shows available shortcuts in an overlay
 */

import {
  getShortcutCategories,
  getShortcutsByCategory,
  formatShortcut,
  getCategoryLabel,
} from '../services/keyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsHelp({
  isOpen,
  onClose,
}: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;
  
  const categories = getShortcutCategories();
  
  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        
        <div className="shortcuts-content">
          {categories.map(category => (
            <div key={category} className="shortcut-category">
              <h3 className="category-title">{getCategoryLabel(category)}</h3>
              <div className="shortcuts-list">
                {getShortcutsByCategory(category).map(shortcut => (
                  <div key={shortcut.action} className="shortcut-item">
                    <kbd className="shortcut-key">{formatShortcut(shortcut)}</kbd>
                    <span className="shortcut-description">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="shortcuts-footer">
          <p>Press <kbd>?</kbd> to toggle this help</p>
        </div>
      </div>
    </div>
  );
}
