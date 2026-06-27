import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  eyebrow: string;
  iconAlt?: string;
  iconSrc?: string;
  title: string;
}

export function AppShell({ children, eyebrow, iconAlt = '', iconSrc = '/icon-192.png', title }: AppShellProps) {
  return (
    <main className="app-shell">
      <header className="top-bar">
        <img src={iconSrc} alt={iconAlt} className="brand-mark" />
        <div>
          <p className="overline">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
      </header>
      {children}
    </main>
  );
}
