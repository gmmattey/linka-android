import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/config')>()),
  SIGNALLQ_BETA_DOWNLOAD_URL: '',
}))

import { PlayStoreBadge } from './PlayStoreBadge'

describe('PlayStoreBadge', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('abre o modal de captura de e-mail em vez de window.alert quando não há URL configurada', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<PlayStoreBadge source="teste" />)

    fireEvent.click(screen.getByRole('button', { name: /disponível no google play/i }))

    expect(alertSpy).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: /teste fechado/i })).toBeInTheDocument()
  })

  it('registra o e-mail e mostra a mensagem de sucesso', () => {
    render(<PlayStoreBadge source="teste" />)
    fireEvent.click(screen.getByRole('button', { name: /disponível no google play/i }))

    fireEvent.change(screen.getByPlaceholderText('nome@email.com'), { target: { value: 'visitante@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /avisar quando lançar/i }))

    expect(screen.getByText(/pronto\. avisamos por e-mail/i)).toBeInTheDocument()
  })

  it('fecha o modal ao clicar em Fechar', () => {
    render(<PlayStoreBadge source="teste" />)
    fireEvent.click(screen.getByRole('button', { name: /disponível no google play/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
