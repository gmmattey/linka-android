import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdSlot } from './AdSlot'

describe('AdSlot', () => {
  it('sem ADSENSE_PUBLISHER_ID configurado -> mostra o criativo simulado, não uma caixa vazia', () => {
    render(<AdSlot />)
    expect(screen.getByText('Publicidade')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo patrocinado')).toBeInTheDocument()
    expect(screen.queryByText(/ainda não configurado/i)).not.toBeInTheDocument()
  })
})
