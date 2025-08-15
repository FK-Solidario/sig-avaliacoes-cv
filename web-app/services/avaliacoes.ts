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

  async criar(dados: Partial<AvaliacaoDesastre>): Promise<Assessment> {
    // Validar e preparar dados obrigatórios
    const dadosCompletos = {
      nome_responsavel: dados.nome_responsavel || '',
      numero_documento: dados.numero_documento || '',
      contacto_telefonico: dados.contacto_telefonico || '',
      membros_agregado: dados.membros_agregado || 0,
      grupos_vulneraveis: dados.grupos_vulneraveis || [],
      endereco_completo: dados.endereco_completo || '',
      ponto_referencia: dados.ponto_referencia || '',
      latitude_gps: dados.latitude_gps || 0,
      longitude_gps: dados.longitude_gps || 0,
      tipo_estrutura: dados.tipo_estrutura || 'habitacao',
      nivel_danos: dados.nivel_danos || 'parcial',
      perdas: dados.perdas || [],
      outras_perdas: dados.outras_perdas || '',
      necessidade_urgente: dados.necessidade_urgente || 'agua_potavel',
      outra_necessidade: dados.outra_necessidade || ''
    }

    try {
      // Fazer chamada real à API
      const avaliacao = await apiService.createAvaliacao(dadosCompletos)
      return this.mapAvaliacaoToAssessment(avaliacao)
    } catch (error) {
      console.error('Erro ao criar avaliação:', error)
      // Se a API falhar, ainda assim lançar o erro para o componente tratar
      throw new Error('Falha ao criar avaliação. Verifique a conexão e tente novamente.')
    }
  }

  async atualizar(id: string | number, dados: Partial<AvaliacaoDesastre>): Promise<Assessment> {
    // Obter avaliação atual para manter campos não alterados
    const avaliacaoAtual = await this.obterPorId(id.toString())
    
    // Preparar dados de atualização
    const dadosAtualizacao = {
      nome_responsavel: dados.nome_responsavel ?? avaliacaoAtual.nome_responsavel,
      numero_documento: dados.numero_documento ?? avaliacaoAtual.numero_documento,
      contacto_telefonico: dados.contacto_telefonico ?? avaliacaoAtual.contacto_telefonico,
      membros_agregado: dados.membros_agregado ?? avaliacaoAtual.membros_agregado,
      grupos_vulneraveis: dados.grupos_vulneraveis ?? avaliacaoAtual.grupos_vulneraveis,
      endereco_completo: dados.endereco_completo ?? avaliacaoAtual.endereco_completo,
      ponto_referencia: dados.ponto_referencia ?? avaliacaoAtual.ponto_referencia,
      latitude_gps: dados.latitude_gps ?? avaliacaoAtual.latitude_gps,
      longitude_gps: dados.longitude_gps ?? avaliacaoAtual.longitude_gps,
      tipo_estrutura: dados.tipo_estrutura ?? avaliacaoAtual.tipo_estrutura,
      nivel_danos: dados.nivel_danos ?? avaliacaoAtual.nivel_danos,
      perdas: dados.perdas ?? avaliacaoAtual.perdas,
      outras_perdas: dados.outras_perdas ?? avaliacaoAtual.outras_perdas,
      necessidade_urgente: dados.necessidade_urgente ?? avaliacaoAtual.necessidade_urgente,
      outra_necessidade: dados.outra_necessidade ?? avaliacaoAtual.outra_necessidade
    }

    try {
      // Fazer chamada real à API
      const avaliacao = await apiService.updateAvaliacao(Number(id), dadosAtualizacao)
      return this.mapAvaliacaoToAssessment(avaliacao)
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error)
      // Se a API falhar, ainda assim lançar o erro para o componente tratar
      throw new Error('Falha ao atualizar avaliação. Verifique a conexão e tente novamente.')
    }
  }

  async eliminar(id: string | number) {
    try {
      await apiService.deleteAvaliacao(Number(id))
      return true
    } catch (error) {
      console.error('Erro ao eliminar avaliação:', error)
      throw new Error('Falha ao eliminar avaliação')
    }
  }

  private mapAvaliacaoToAssessment(avaliacao: AvaliacaoDesastre): Assessment {
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
}

export const avaliacoesService = new AvaliacoesService()