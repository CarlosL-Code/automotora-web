'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '64px',
        height: '32px',
        borderRadius: '30px',
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.2)',
        cursor: 'pointer',
        padding: '0 6px',
        transition: 'all 0.3s ease',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2)'
      }}
      aria-label="Alternar tema"
      title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      {/* Iconos de fondo */}
      <Moon size={14} color="#a0aec0" />
      <Sun size={14} color="#f6e05e" />
      
      {/* Círculo deslizable */}
      <div style={{
        position: 'absolute',
        top: '3px',
        left: theme === 'dark' ? '35px' : '3px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {theme === 'dark' ? <Moon size={14} color="#475569" /> : <Sun size={14} color="#d69e2e" />}
      </div>
    </button>
  );
}
