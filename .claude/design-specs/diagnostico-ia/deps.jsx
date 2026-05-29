/* Dependências das telas de diagnóstico, extraídas dos demais screens do app.
   ICONS: subconjunto usado em diagnostico.jsx (de screens/home.jsx).
   UseRow: linha de "impacto no uso" (de screens/resultado.jsx). */

const ICONS = {
  wifi: 'M12 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9l2 2a10 10 0 0 1 14 0l2-2A13 13 0 0 0 3 9Zm4 4 2 2a4.5 4.5 0 0 1 6 0l2-2a7.5 7.5 0 0 0-10 0Z',
  language: 'M11.99 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 6h-2.95a15.66 15.66 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14a7.8 7.8 0 0 1 0-4h3.38a16.55 16.55 0 0 0 0 4H4.26Zm.82 2h2.95a15.65 15.65 0 0 0 1.38 3.56A8 8 0 0 1 5.08 16Zm2.95-8H5.08a8 8 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8ZM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82A14.65 14.65 0 0 1 12 19.96ZM14.34 14H9.66a14.78 14.78 0 0 1 0-4h4.68a14.65 14.65 0 0 1 0 4Zm.25 5.56c.6-1.1 1.07-2.29 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14a16.55 16.55 0 0 0 0-4h3.38a7.8 7.8 0 0 1 0 4h-3.38Z',
  insights: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM9 17H7v-7h2v7Zm4 0h-2V7h2v10Zm4 0h-2v-4h2v4Z',
  tower: 'M7.3 14.7 5.9 16.1A6 6 0 0 1 4 12a6 6 0 0 1 1.9-4.1L7.3 9.3A4 4 0 0 0 6 12a4 4 0 0 0 1.3 2.7ZM12 6a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm6.1 2.1-1.4-1.4A4 4 0 0 0 18 12a4 4 0 0 0-1.3-2.7l1.4-1.4A6 6 0 0 1 20 12a6 6 0 0 1-1.9 4.1Z',
  ping: 'M3 6.4 4.4 5l4.6 4.6L19 5l1.4 1.4L9 17.8 3 11.8V6.4Z',
};
window.ICONS = ICONS;

/* function declaration → global (acessível pelos demais scripts babel) */
function UseRow({ icon, label, v, c }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `0.5px solid ${LK.border}` }}>
      <Icon d={icon} size={16} color={LK.textSecondary} />
      <span style={{ flex: 1, fontSize: 12, color: LK.textSecondary }}>{label}</span>
      <span style={{ fontSize: 10, color: c, background: `${c}26`, padding: '3px 8px', borderRadius: 4 }}>{v}</span>
    </div>
  );
}
