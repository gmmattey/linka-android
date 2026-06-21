/* SignallQ design tokens — extraídos diretamente de SignallQTheme.kt */
const LK = {
  // Brand
  accent: '#6C2BFF',
  accentBlue: '#2563EB',
  // Status
  success: '#22C55E',
  warning: '#F5A623',
  error:   '#FF4D4F',
  // Speedtest phases
  phaseLatencia: '#60A5FA',
  phaseDownload: '#34D399',
  phaseUpload:   '#FBBF24',
  // Light surface
  bgPrimary:     '#FFFFFF',
  bgSecondary:   '#F3F4F6',
  bgCard:        '#FFFFFF',
  textPrimary:   '#0D0D1A',
  textSecondary: '#6B7280',
  textTertiary:  '#9CA3AF',
  border:        '#E5E7EB',
  warningContainer:   '#FFF3CD',
  onWarningContainer: '#7A4E00',
  amberSurface:       '#FFF8E6',
  successContainer:   '#D1FAE5',
  onSuccessContainer: '#065F46',
  // SignallQ (always dark)
  linkaBlack:        '#0D0D1A',
  linkaDarkSurface:  '#1A0B2E',
  linkaDarkCard:     '#1E1130',
  linkaTextOnDark:   '#F3F4F6',
  linkaTextSecondaryOnDark: '#9CA3AF',
  // Radius
  rCard: 16,
  rButton: 12,
  rInput: 12,
};

// Compact phone frame matching SignallQ's edge-to-edge Material 3 app
function PhoneFrame({ children, label, dark = false, scale = 1, w = 360, h = 740 }) {
  const bg = dark ? LK.linkaBlack : LK.bgPrimary;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: w, height: h,
        borderRadius: 38, padding: 8,
        background: dark ? '#0a0a14' : '#1a1a24',
        boxShadow: '0 30px 60px -20px rgba(15,23,42,0.25), 0 8px 24px -8px rgba(15,23,42,0.18)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          width: 16, height: 16, borderRadius: 12, background: '#000', zIndex: 10,
        }} />
        <div style={{
          width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden',
          background: bg, position: 'relative',
          fontFamily: 'Roboto, "Segoe UI", system-ui, sans-serif',
          color: dark ? LK.linkaTextOnDark : LK.textPrimary,
        }}>
          {/* status bar */}
          <div style={{
            height: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0 18px', fontSize: 12, fontWeight: 600,
            color: dark ? LK.linkaTextOnDark : LK.textPrimary,
          }}>
            <span>9:41</span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M7 1.6 1 4.5 7 9l6-4.5L7 1.6Z" fill="currentColor" opacity=".4" />
                <path d="M7 1.6 4 4l3 2.2 3-2.2-3-2.4Z" fill="currentColor" />
              </svg>
              <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 9h2V5H1v4Zm4 0h2V3H5v6Zm4 0h2V1H9v8Z" fill="currentColor" /></svg>
              <svg width="20" height="10" viewBox="0 0 20 10"><rect x="1" y="1" width="16" height="8" rx="1.5" stroke="currentColor" fill="none" /><rect x="2.5" y="2.5" width="11" height="5" fill="currentColor" /><rect x="17.5" y="3.5" width="1.5" height="3" rx=".5" fill="currentColor" /></svg>
            </span>
          </div>
          <div style={{ height: 'calc(100% - 28px)', overflow: 'hidden', position: 'relative' }}>
            {children}
          </div>
        </div>
      </div>
      {label && <div style={{
        fontFamily: 'ui-monospace, SF Mono, monospace', fontSize: 11,
        color: '#6B7280', letterSpacing: 0.5, textAlign: 'center', maxWidth: w,
      }}>{label}</div>}
    </div>
  );
}

// Material 3 bottom navigation matching AppShell.kt — 5 tabs
function BottomNav({ active = 0 }) {
  const tabs = [
    { label: 'Início',     icon: 'home' },
    { label: 'Velocidade', icon: 'speed' },
    { label: 'Sinal',      icon: 'wifi' },
    { label: 'Histórico',  icon: 'history' },
    { label: 'Ajustes',    icon: 'settings' },
  ];
  const icons = {
    home: (filled) => <path fill="currentColor" d={filled ? 'M12 3 4 9v12h5v-7h6v7h5V9l-8-6Z' : 'M12 5.7 18 10.2V19h-3v-7H9v7H6v-8.8L12 5.7m0-2.7L4 9v12h5v-7h6v7h5V9l-8-6Z'} />,
    speed: (filled) => <path fill="currentColor" d={filled ? 'M20.4 5.6a10 10 0 1 0 1.4 11.9H19a8 8 0 1 1-1-9.6l-2.5 2.4 1 1 4.9-4.7v-1ZM12 8v6h6V12h-4V8h-2Z' : 'M12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6V4Zm-1 4v6h6v-2h-4V8h-2Z'} />,
    wifi: (filled) => <path fill="currentColor" d={filled ? 'M1 9l2 2a13 13 0 0 1 18 0l2-2A16 16 0 0 0 1 9Zm8 8 3 3 3-3a4 4 0 0 0-6 0Zm-4-4 2 2a7 7 0 0 1 10 0l2-2a10 10 0 0 0-14 0Z' : 'M12 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9l2 2a10 10 0 0 1 14 0l2-2A13 13 0 0 0 3 9Zm4 4 2 2a4.5 4.5 0 0 1 6 0l2-2a7.5 7.5 0 0 0-10 0Z'} />,
    history: (filled) => <path fill="currentColor" d={filled ? 'M13 3a9 9 0 0 0-9 9H1l4 4 4-4H6a7 7 0 1 1 7 7v2a9 9 0 0 0 0-18Zm-1 5v5l4 2 1-2-3-2V8h-2Z' : 'M13 3a9 9 0 0 0-9 9H1l4 4 4-4H6a7 7 0 1 1 7 7v2a9 9 0 0 0 0-18Zm-1 5v5l4 2 1-2-3-2V8h-2Z'} />,
    settings: (filled) => <path fill="currentColor" d={filled ? 'M19.4 13a8 8 0 0 0 0-2l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L15 3.5h-4l-.4 2.6a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a8 8 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1L11 20.5h4l.4-2.6a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5ZM13 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z' : 'M19.4 13a8 8 0 0 0 0-2l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L15 3.5h-4l-.4 2.6a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a8 8 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1L11 20.5h4l.4-2.6a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5ZM13 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z'} />,
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 78,
      background: LK.bgSecondary, borderTop: `1px solid ${LK.border}`,
      display: 'flex', alignItems: 'flex-start', paddingTop: 12,
    }}>
      {tabs.map((t, i) => {
        const sel = i === active;
        const color = sel ? LK.accent : LK.textTertiary;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color }}>
            <div style={{
              width: 64, height: 32, borderRadius: 16,
              background: sel ? `${LK.accent}1F` : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24">{icons[t.icon](sel)}</svg>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Top app bar matching CenterAlignedTopAppBar
function TopBar({ title, subtitle, leading, trailing }) {
  return (
    <div style={{
      padding: '14px 16px 10px', display: 'flex', alignItems: 'flex-start', gap: 12,
      background: LK.bgPrimary, position: 'relative',
    }}>
      <div style={{ width: 32, height: 32 }}>{leading}</div>
      <div style={{ flex: 1, textAlign: 'center', paddingTop: 4 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: LK.textPrimary }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: LK.textSecondary, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 32, height: 32 }}>{trailing}</div>
    </div>
  );
}

function Avatar({ initial = 'M', size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${LK.accent}, ${LK.accentBlue})`,
      color: '#fff', fontSize: size * 0.45, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{initial}</div>
  );
}

// Generic card following SignallQCard
function Card({ children, style }) {
  return (
    <div style={{
      background: LK.bgCard, border: `1px solid ${LK.border}`,
      borderRadius: LK.rCard, padding: 16, ...style,
    }}>{children}</div>
  );
}

// Tiny icon helper
function Icon({ d, size = 20, color = 'currentColor', viewBox = '0 0 24 24' }) {
  return <svg width={size} height={size} viewBox={viewBox} style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d={d} fill={color} /></svg>;
}

Object.assign(window, { LK, PhoneFrame, BottomNav, TopBar, Avatar, Card, Icon });
