import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface Consulta {
  id: number;
  dataHora: string;
  valorEmPontos: number;
  vagasDisponiveis: number;
  totalVagas: number;
  status: string;
  profissional: {
    id: number;
    nome: string;
    crm: string;
    telefone: string;
    status: string;
  };
  especialidade: {
    id: number;
    nome: string;
  };
}

interface AgendamentoResponse {
  id: number;
  message?: string;
}

@Component({
  selector: 'app-agendar-consulta',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './agendar-consulta.component.html',
  styleUrls: ['./agendar-consulta.component.css']
})
export class AgendarConsultaComponent implements OnInit {
  consultas: Consulta[] = [];
  consultasFiltradas: Consulta[] = [];
  especialidadesUnicas: string[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  pacienteId: number | null = null;

  filtroMedico: string = '';
  filtroEspecialidade: string = '';
  ordem: string = 'data';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const pacienteIdStr = localStorage.getItem('paciente_id');
    if (pacienteIdStr && !isNaN(Number(pacienteIdStr))) {
      this.pacienteId = parseInt(pacienteIdStr, 10);
      this.carregarConsultas();
    } else {
      this.errorMessage = 'ID do paciente não encontrado. Faça login novamente.';
      this.isLoading = false;
    }
  }

  carregarConsultas(): void {
    this.http.get<Consulta[]>('http://localhost:8083/consultas')
      .subscribe({
        next: (data) => {
          // Filtrar consultas: status DISPONÍVEL, vagasDisponiveis > 0, e profissional ativo
          this.consultas = data.filter(consulta =>
            consulta.status === 'DISPONÍVEL' &&
            consulta.vagasDisponiveis > 0 &&
            consulta.profissional.status === 'ATIVO'
          );

          // Extrair especialidades únicas para o filtro
          this.especialidadesUnicas = [...new Set(this.consultas.map(c => c.especialidade.nome))];

          this.aplicarFiltros();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar consultas:', err);
          this.errorMessage = 'Erro ao carregar consultas disponíveis. Tente novamente.';
          this.isLoading = false;
        }
      });
  }

  // Converter pontos para reais (1 ponto = R$5)
  converterPontosParaReais(pontos: number): string {
    return (pontos * 5).toFixed(2);
  }

  // Filtrar consultas por nome do médico
  filtrarConsultas(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroMedico = input.value.toLowerCase();
    this.aplicarFiltros();
  }

  // Filtrar por especialidade
  filtrarPorEspecialidade(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroEspecialidade = select.value;
    this.aplicarFiltros();
  }

  // Ordenar consultas
  ordenarConsultas(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.ordem = select.value;
    this.aplicarFiltros();
  }

  // Aplicar todos os filtros e ordenação
  aplicarFiltros(): void {
    // Aplicar filtros
    let resultado = [...this.consultas];

    // Filtrar por médico
    if (this.filtroMedico) {
      resultado = resultado.filter(consulta =>
        consulta.profissional.nome.toLowerCase().includes(this.filtroMedico)
      );
    }

    // Filtrar por especialidade
    if (this.filtroEspecialidade) {
      resultado = resultado.filter(consulta =>
        consulta.especialidade.nome === this.filtroEspecialidade
      );
    }

    // Ordenar
    resultado.sort((a, b) => {
      switch(this.ordem) {
        case 'data':
          return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime();
        case 'valor':
          return a.valorEmPontos - b.valorEmPontos;
        case 'valor-desc':
          return b.valorEmPontos - a.valorEmPontos;
        default:
          return 0;
      }
    });

    this.consultasFiltradas = resultado;
  }

  agendarConsulta(consultaId: number): void {
    if (!this.pacienteId) {
      this.errorMessage = 'ID do paciente não disponível.';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const agendamento = {
      pacienteId: this.pacienteId,
      consultaId: consultaId
    };

    this.http.post('http://localhost:8081/agendamentos', agendamento, {
      responseType: 'text'
    }).subscribe({
      next: (responseText) => {
        try {

          const response: AgendamentoResponse = JSON.parse(responseText);
          this.successMessage = response.message || 'Agendamento realizado com sucesso!';
        } catch (e) {

          this.successMessage = responseText;
        }


        setTimeout(() => {
          this.carregarConsultas();

        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao agendar:', err);

        if (err.status === 400) {
          this.errorMessage = 'Dados inválidos. Verifique os campos.';
        } else if (err.status === 404) {
          this.errorMessage = 'Consulta não encontrada.';
        } else if (err.status === 409) {
          this.errorMessage = 'Você já possui um agendamento para esta consulta.';
        } else if (err.status === 422) {
          this.errorMessage = 'Não há vagas disponíveis para esta consulta.';
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Erro ao realizar agendamento. Tente novamente.';
        }

        // Recarregar consultas para atualizar disponibilidade
        this.carregarConsultas();
      }
    });
  }
}
