// Banner "Nova versão disponível" do Service Worker.
//
// Estratégia (resolve o ciclo de update conservador do Safari/iOS), portada
// do repo antecessor linka-speedtest:
//   1. `registerType: 'autoUpdate'` + `skipWaiting`/`clientsClaim` no
//      vite.config.ts — o novo SW assume controle imediatamente.
//   2. Verificação periódica a cada 60s via `registration.update()` —
//      garante que o navegador re-cheque o service worker mesmo sem reload.
//   3. UX explícita: ao detectar nova versão, mostra este banner com
//      "Atualizar" (força reload) ou "Fechar" (adia até a próxima visita).
//
// Sem reload-surpresa: o usuário escolhe quando aplicar a atualização.
import { useRegisterSW } from 'virtual:pwa-register/react'
import './PwaUpdatePrompt.css'

const UPDATE_CHECK_INTERVAL_MS = 60_000

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (!registration) return
      setInterval(() => {
        registration.update().catch(() => {
          // offline ou falha transiente — próxima verificação tenta de novo
        })
      }, UPDATE_CHECK_INTERVAL_MS)
    },
    onRegisterError(error) {
      console.warn('[pwa] falha ao registrar service worker:', error)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="sq-pwa-update" role="status" aria-live="polite">
      <span className="sq-pwa-update__text">Nova versão disponível</span>
      <button type="button" className="sq-pwa-update__button" onClick={() => { void updateServiceWorker(true) }}>
        Atualizar
      </button>
      <button type="button" className="sq-pwa-update__close" onClick={() => setNeedRefresh(false)} aria-label="Fechar">
        ×
      </button>
    </div>
  )
}
