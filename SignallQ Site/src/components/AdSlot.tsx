import { useEffect, useRef, useState } from 'react'
import { ADSENSE_PUBLISHER_ID, ADSENSE_SLOT_RESULT } from '../lib/config'

interface AdSlotProps {
  format?: 'horizontal' | 'square'
  slot?: string
}

// Único slot de anúncio do site (pedido explícito do Luiz: sem popup/banner
// extra) — reserva espaço fixo (sem CLS) e só injeta o script real do AdSense
// quando ADSENSE_PUBLISHER_ID estiver configurado. Sem os IDs, mostra
// placeholder "ainda não configurado" — nunca um anúncio vazio ou quebrado.
export function AdSlot({ format = 'horizontal', slot }: AdSlotProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted || !hostRef.current) return
    const effectiveSlot = slot || ADSENSE_SLOT_RESULT
    if (!ADSENSE_PUBLISHER_ID || !effectiveSlot) return
    setMounted(true)

    const ins = document.createElement('ins')
    ins.className = 'adsbygoogle'
    ins.style.display = 'block'
    ins.style.width = '100%'
    ins.setAttribute('data-ad-client', ADSENSE_PUBLISHER_ID)
    ins.setAttribute('data-ad-slot', effectiveSlot)
    ins.setAttribute('data-ad-format', 'auto')
    ins.setAttribute('data-full-width-responsive', 'true')
    hostRef.current.innerHTML = ''
    hostRef.current.appendChild(ins)

    if (!document.querySelector('script[data-adsbygoogle-loader]')) {
      const s = document.createElement('script')
      s.async = true
      s.setAttribute('data-adsbygoogle-loader', '1')
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`
      s.crossOrigin = 'anonymous'
      document.head.appendChild(s)
    }
    ;(window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []
    ;(window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({})
  }, [mounted, slot])

  return (
    <div
      className="flex w-full flex-col gap-2.5 rounded-2xl border p-3 box-border"
      style={{
        minHeight: format === 'square' ? 250 : 100,
        borderColor: 'color-mix(in srgb, var(--border) 20%, transparent)',
        background: 'var(--bg-card)',
      }}
    >
      <div className="overline" style={{ color: 'var(--text-tertiary)' }}>
        Publicidade
      </div>
      <div ref={hostRef} className="flex w-full justify-center">
        {/* Criativo simulado (não é anúncio real) — ativa sozinho assim que
            ADSENSE_PUBLISHER_ID/ADSENSE_SLOT_RESULT forem configurados em
            lib/config.ts, sem precisar tocar neste componente. Visual
            genérico e neutro (nenhuma marca/produto real), só pra o slot
            não aparecer como uma caixa vazia enquanto o AdSense real não
            está ligado. */}
        {!mounted && (
          <div
            className={`flex w-full items-center gap-3 rounded-xl p-3 ${format === 'square' ? 'flex-col text-center' : ''}`}
            style={{ background: 'color-mix(in srgb, var(--border) 8%, transparent)' }}
          >
            <div
              className="flex shrink-0 items-center justify-center rounded-lg"
              style={{
                width: format === 'square' ? 96 : 64,
                height: format === 'square' ? 96 : 64,
                background: 'color-mix(in srgb, var(--text-tertiary) 16%, transparent)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--text-tertiary)' }}>
                image
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="label-large">Conteúdo patrocinado</div>
              <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                Anúncios relevantes aparecem aqui.
              </div>
            </div>
            <button
              type="button"
              disabled
              className="shrink-0 rounded-full border px-3 py-1.5 label-medium"
              style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)', color: 'var(--text-secondary)' }}
            >
              Saiba mais
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
