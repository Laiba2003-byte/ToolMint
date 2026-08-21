import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { useNavigation } from './hooks/useNavigation';
import { getToolByRoute, ACTIVE_TOOLS } from './registry/tools';

export function AppContent() {
  const { currentPath, navigate } = useNavigation();
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

  // Match current tool if on a tool route
  const currentTool = getToolByRoute(currentPath);

  // Dynamically update document title & meta tags for SEO
  useEffect(() => {
    if (currentTool) {
      document.title = currentTool.seoTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', currentTool.seoDescription);
      }
    } else {
      document.title = 'ToolMint — Tiny tools. Zero friction.';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Fast, privacy-first utilities for developers. No login, no clutter — just the tool you need.'
        );
      }
    }
  }, [currentTool]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenCommandPalette={() => setIsCmdPaletteOpen(true)}
      />

      {/* Main Page Area */}
      <div className="flex-1">
        {currentTool ? (
          <ToolPage tool={currentTool} onNavigate={navigate} />
        ) : (
          <HomePage
            onNavigate={navigate}
            onOpenCommandPalette={() => setIsCmdPaletteOpen(true)}
          />
        )}
      </div>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Command Palette Search Modal */}
      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        onSelectTool={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
