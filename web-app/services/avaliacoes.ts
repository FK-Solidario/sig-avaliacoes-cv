import { apiService } from './api'
import { Assessment, AvaliacaoDesastre } from '@/types'

class AvaliacoesService {
  async obterTodas(): Promise<Assessment[]> {
    const avaliacoes = await apiService.getAvaliacoes()
    
    // Converter cada AvaliacaoDesastre para Assessment
    return avaliacoes.map(avaliacao => ({
      // Propriedades de AvaliacaoDesastre
      id: avaliacao.id,
      nome_responsavel: avaliacao.nome_responsavel,
      numero_documento: avaliacao.numero_documento,
      contacto_telefonico: avaliacao.contacto_telefonico,
      membros_agregado: avaliacao.membros_agregado,
      grupos_vulneraveis: avaliacao.grupos_vulneraveis,
      endereco_completo: avaliacao.endereco_completo,
      ponto_referencia: avaliacao.ponto_referencia,
      latitude_gps: avaliacao.latitude_gps,
      longitude_gps: avaliacao.longitude_gps,
      tipo_estrutura: avaliacao.tipo_estrutura,
      nivel_danos: avaliacao.nivel_danos,
      perdas: avaliacao.perdas,
      outras_perdas: avaliacao.outras_perdas,
      ficheiros_prova: avaliacao.ficheiros_prova,
      necessidade_urgente: avaliacao.necessidade_urgente,
      outra_necessidade: avaliacao.outra_necessidade,
      data_criacao: avaliacao.data_criacao,
      data_atualizacao: avaliacao.data_atualizacao,
      // Propriedades adicionais de Assessment
      title: `Avaliação - ${avaliacao.nome_responsavel}`,
      description: avaliacao.outras_perdas || 'Sem descrição',
      location: {
        latitude: avaliacao.latitude_gps || 0,
        longitude: avaliacao.longitude_gps || 0,
        address: avaliacao.endereco_completo
      },
      disaster_type: avaliacao.tipo_estrutura,
      severity: avaliacao.nivel_danos,
      status: 'completed',
      assigned_to: null,
      created_by: 'system',
      completed_at: null,
      estimated_damage: null,
      affected_people: avaliacao.membros_agregado,
      notes: avaliacao.outras_perdas
    } as Assessment))
  }

  async obterPorId(id: string): Promise<Assessment> {
    const avaliacoes = await apiService.getAvaliacoes()
    const avaliacao = avaliacoes.find(a => a.id.toString() === id)
    
    if (!avaliacao) {
      throw new Error('Avaliação não encontrada')
    }

    // Converter AvaliacaoDesastre para Assessment
    return {
      // Propriedades de AvaliacaoDesastre
      id: avaliacao.id,
      nome_responsavel: avaliacao.nome_responsavel,
      numero_documento: avaliacao.numero_documento,
      contacto_telefonico: avaliacao.contacto_telefonico,
      membros_agregado: avaliacao.membros_agregado,
      grupos_vulneraveis: avaliacao.grupos_vulneraveis,
      endereco_completo: avaliacao.endereco_completo,
      ponto_referencia: avaliacao.ponto_referencia,
      latitude_gps: avaliacao.latitude_gps,
      longitude_gps: avaliacao.longitude_gps,
      tipo_estrutura: avaliacao.tipo_estrutura,
      nivel_danos: avaliacao.nivel_danos,
      perdas: avaliacao.perdas,
      outras_perdas: avaliacao.outras_perdas,
      ficheiros_prova: avaliacao.ficheiros_prova,
      necessidade_urgente: avaliacao.necessidade_urgente,
      outra_necessidade: avaliacao.outra_necessidade,
      data_criacao: avaliacao.data_criacao,
      data_atualizacao: avaliacao.data_atualizacao,
      // Propriedades adicionais de Assessment
      title: `Avaliação - ${avaliacao.nome_responsavel}`,
      description: avaliacao.outras_perdas || 'Sem descrição',
      location: {
        latitude: avaliacao.latitude_gps || 0,
        longitude: avaliacao.longitude_gps || 0,
        address: avaliacao.endereco_completo
      },
      disaster_type: avaliacao.tipo_estrutura,
      severity: avaliacao.nivel_danos,
      status: 'completed',
      assigned_to: null,
      created_by: 'system',
      completed_at: null,
      estimated_damage: null,
      affected_people: avaliacao.membros_agregado,
      notes: avaliacao.outras_perdas
    } as Assessment
  }

  async criar(dados: Partial<AvaliacaoDesastre>) {
    // Simular criação - em produção seria uma chamada à API
    console.log('Criando avaliação:', dados)
    return { id: Date.now(), ...dados }
  }

  async atualizar(id: string | number, dados: Partial<AvaliacaoDesastre>) {
    // Simular atualização - em produção seria uma chamada à API
    console.log('Atualizando avaliação:', id, dados)
    return { id, ...dados }
  }

  async eliminar(id: string | number) {
    // Simular eliminação - em produção seria uma chamada à API
    console.log('Eliminando avaliação:', id)
    return true
  }
}

export const avaliacoesService = new AvaliacoesService()