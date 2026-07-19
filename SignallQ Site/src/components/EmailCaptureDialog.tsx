import { useState } from 'react'

// Padrão compartilhado de captura de e-mail para "avisar quando lançar" —
// nasceu no modal inline do ProPage.tsx e foi extraído aqui pra ser reaproveitado
// também no PlayStoreBadge (fallback do SignallQ gratuito). Copy e cor de acento
// vêm por props: cada produto mantém sua própria identidade visual e tom.
//
// Pendência conhecida (mesma do modal original do PRO): captura de e-mail ainda
// não tem destino real (sem tabela D1/CRM decidida) — hoje só dispara telemetria
// via onSubmit. Decidir e implementar o armazenamento real antes de anunciar a
// lista de espera publicamente, senão a mensagem de sucesso vira promessa vazia.

interface EmailCaptureDialogProps {
  icon: string
  accentColor: string
  title: string
  body: string
  inputLabel: string
  inputPlaceholder: string
  submitButtonText: string
  successMessage: string
  errorMessage?: string
  secondaryLabel?: string
  onSecondary?: () => void
  onSubmit: (email: string) => void
  onClose: () => void
}

export function EmailCaptureDialog({
  icon,
  accentColor,
  title,
  body,
  inputLabel,
  inputPlaceholder,
  submitButtonText,
  successMessage,
  errorMessage,
  secondaryLabel,
  onSecondary,
  onSubmit,
  onClose,
}: EmailCaptureDialogProps) {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(false)

  const handleSubmit = () => {
    try {
      onSubmit(email)
      setEnviado(true)
      setErro(false)
    } catch {
      setErro(true)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-5" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[380px] flex-col items-center gap-3.5 rounded-3xl p-7 text-center"
        style={{ background: 'var(--bg-card)' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 34, color: accentColor }}>
          {icon}
        </span>
        <div className="title-large">{title}</div>
        {!enviado ? (
          <>
            <div className="body-medium">{body}</div>
            <label className="sr-only" htmlFor="email-captura">
              {inputLabel}
            </label>
            <input
              id="email-captura"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full rounded-[var(--radius-field)] border px-3.5 py-2.5 body-medium"
              style={{ borderColor: 'var(--border)' }}
            />
            {erro && errorMessage && (
              <div className="body-small" style={{ color: 'var(--error)' }}>
                {errorMessage}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={!email.includes('@')}
              className="mt-1 h-11 w-full rounded-[var(--radius-button)] text-white label-large disabled:opacity-40"
              style={{ background: accentColor }}
            >
              {submitButtonText}
            </button>
          </>
        ) : (
          <div className="body-medium" style={{ color: 'var(--success)' }}>
            {successMessage}
          </div>
        )}
        <div className="mt-1.5 flex w-full gap-2.5">
          <button onClick={onClose} className="h-11 flex-1 rounded-[var(--radius-button)] border label-large" style={{ borderColor: 'var(--border)' }}>
            Fechar
          </button>
          {secondaryLabel && onSecondary && (
            <button onClick={onSecondary} className="h-11 flex-1 rounded-[var(--radius-button)] text-white label-large" style={{ background: 'var(--accent)' }}>
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
