import { Link } from 'react-router-dom'
import { Logo } from '../Logo'
import { PlayStoreBadge } from '../PlayStoreBadge'
import { ProBadge } from '../ProBadge'
import { useSystemTheme } from '../../hooks/useSystemTheme'

// Achado importante da Lia: o CTA de download só existia como badge pequeno
// ao lado do pill do PRO, com o mesmo peso visual — perdendo a ação comercial
// principal da home. Card dedicado com badge maior (56px) antes da seção
// "Velocidade não conta a história toda"; o pill do PRO fica abaixo, em
// hierarquia secundária.
export function DownloadAppCallout() {
  const isDark = useSystemTheme()

  return (
    <div className="flex w-full max-w-[460px] flex-col items-center gap-4 rounded-2xl border p-6 text-center" style={{ borderColor: 'color-mix(in srgb, var(--border) 20%, transparent)', background: 'var(--bg-card)' }}>
      <Logo isDark={isDark} height={28} />
      <div className="headline-small">Leve o SignallQ com você</div>
      <div className="body-medium">Meça sua conexão de qualquer lugar e acompanhe o histórico direto no app.</div>
      <PlayStoreBadge height={56} source="resultado-callout" />

      <Link
        to="/pro"
        className="mt-2 flex items-center gap-2.5 rounded-full border px-4 py-1.5 no-underline"
        style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}
      >
        <Logo isDark={isDark} height={16} />
        <ProBadge />
        <span className="label-large">Conhecer</span>
      </Link>
    </div>
  )
}
