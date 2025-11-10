import { useEffect } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          Boolean(e.ctrlKey) === Boolean(shortcut.ctrlKey) &&
          Boolean(e.metaKey) === Boolean(shortcut.metaKey) &&
          Boolean(e.altKey) === Boolean(shortcut.altKey) &&
          Boolean(e.shiftKey) === Boolean(shortcut.shiftKey)
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);

  // Return list of shortcuts for documentation
  return shortcuts.map(({ key, ctrlKey, metaKey, altKey, shiftKey, description }) => ({
    key,
    ctrlKey,
    metaKey,
    altKey,
    shiftKey,
    description,
  }));
}

export default useKeyboardShortcuts;