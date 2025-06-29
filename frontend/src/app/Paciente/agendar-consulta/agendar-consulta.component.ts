import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth-service.service';
import { Observable } from 'rxjs'; // Importar Observable
import { PacienteService } from '../../Services/paciente-service'; // Importa PacienteService

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

interface Paciente {
  id: number;
  saldoPontos: number;
}

// Interface para a resposta do endpoint de especialidades
interface EspecialidadeResponse {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-agendar-consulta',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './agendar-consulta.component.html',
  styleUrls: ['./agendar-consulta.component.css']
})
export class AgendarConsultaComponent implements OnInit {
  // Injeções
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private pacienteService = inject(PacienteService); // Injeta o PacienteService

  consultas: Consulta[] = [];
  consultasFiltradas: Consulta[] = [];
  especialidadesUnicas: string[] = []; // Irá armazenar apenas os nomes das especialidades
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  pacienteId: number | null = null;
  saldoPontos: number = 0; // Este saldo será apenas local, o serviço gerencia o global.

  // Variáveis para o modal de pontos
  showPontosModal: boolean = false;
  pontosParaUsar: number = 0;
  consultaSelecionadaId: number | null = null;
  consultaDetalhes: any = null;
  valorDinheiro: number = 0;

  filtroMedico: string = '';
  filtroEspecialidade: string = '';
  ordem: string = 'data';

  constructor() {}

  ngOnInit(): void {
    const pacienteIdStr = localStorage.getItem('paciente_id');
    if (pacienteIdStr && !isNaN(Number(pacienteIdStr))) {
      this.pacienteId = parseInt(pacienteIdStr, 10);
      this.carregarConsultas();
      this.carregarSaldoPontos();
      this.carregarEspecialidades(); // Carrega as especialidades do backend
    } else {
      this.errorMessage = 'ID do paciente não encontrado. Faça login novamente.';
      this.isLoading = false;
      console.error('ID do paciente não encontrado no localStorage.');
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      this.errorMessage = 'Token de autenticação ausente. Faça login novamente.';
      this.authService.logout();
      this.router.navigate(['/login']);
      throw new Error('Token de autenticação não encontrado.');
    }
  }

  private carregarSaldoPontos(): void {
    if (!this.pacienteId) return;

    try {
      const headers = this.getAuthHeaders();
      this.http.get<Paciente>(`http://localhost:8080/pacientes/pacientes/${this.pacienteId}`, { headers })
        .subscribe({
          next: (paciente) => {
            this.saldoPontos = paciente.saldoPontos;
            // Notifica o PacienteService sobre o saldo atualizado
            this.pacienteService.atualizarSaldo(paciente.saldoPontos);
          },
          error: (err) => {
            console.error('Erro ao carregar saldo de pontos:', err);
            if (err.status === 401 || err.status === 403) {
              this.errorMessage = 'Sessão expirada ou não autorizada. Faça login novamente.';
              this.authService.logout();
              this.router.navigate(['/login']);
            } else {
              this.errorMessage = 'Erro ao carregar saldo de pontos. Tente novamente.';
            }
          }
        });
    } catch (error: any) {
        console.error('Erro ao preparar requisição de saldo:', error.message);
        this.errorMessage = error.message;
    }
  }

  private carregarEspecialidades(): void {
    try {
      const headers = this.getAuthHeaders();
      // O endpoint para especialidades era 'http://localhost:8080/especialidades' no backend
      // Se ele está sob '/pacientes' no seu gateway, ajuste aqui.
      this.http.get<EspecialidadeResponse[]>('http://localhost:8080/pacientes/especialidades', { headers })
        .subscribe({
          next: (data) => {
            this.especialidadesUnicas = data.map(especialidade => especialidade.nome);
            this.especialidadesUnicas.sort();
          },
          error: (err) => {
            console.error('Erro ao carregar especialidades:', err);
            if (err.status === 401 || err.status === 403) {
              this.errorMessage = 'Sessão expirada ou não autorizada ao carregar especialidades. Faça login novamente.';
              this.authService.logout();
              this.router.navigate(['/login']);
            } else {
              this.errorMessage = 'Erro ao carregar lista de especialidades. Tente novamente.';
            }
          }
        });
    } catch (error: any) {
        console.error('Erro ao preparar requisição de especialidades:', error.message);
        this.errorMessage = error.message;
    }
  }

  carregarConsultas(): void {
    this.isLoading = true;
    this.errorMessage = null;

    if (!this.pacienteId) {
      this.errorMessage = 'ID do paciente não disponível para carregar consultas.';
      this.isLoading = false;
      return;
    }

    try {
      const headers = this.getAuthHeaders();
      // LINHA CORRIGIDA AQUI: Uso de crases para template literal e o endpoint com pacienteId
      this.http.get<Consulta[]>(`http://localhost:8080/pacientes/consultas/disponiveis-para-paciente/${this.pacienteId}`, { headers })
        .subscribe({
          next: (data) => {
            this.consultas = data.filter(consulta =>
              consulta.status === 'DISPONÍVEL' &&
              consulta.vagasDisponiveis > 0 &&
              consulta.profissional.status === 'ATIVO'
            );

            this.aplicarFiltros();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar consultas:', err);
            if (err.status === 401 || err.status === 403) {
              this.errorMessage = 'Sessão expirada ou não autorizada. Faça login novamente.';
              this.authService.logout();
              this.router.navigate(['/login']);
            } else {
              this.errorMessage = 'Erro ao carregar consultas disponíveis. Tente novamente.';
            }
            this.isLoading = false;
          }
        });
    } catch (error: any) {
        console.error('Erro ao preparar requisição de consultas:', error.message);
        this.errorMessage = error.message;
        this.isLoading = false;
    }
  }

  abrirModalPontos(consulta: Consulta): void {
    this.consultaSelecionadaId = consulta.id;
    this.consultaDetalhes = {
      especialidade: consulta.especialidade.nome,
      profissional: consulta.profissional.nome,
      valorEmPontos: consulta.valorEmPontos
    };
    this.pontosParaUsar = 0;
    this.calcularValorDinheiro();
    this.showPontosModal = true;
  }

  fecharModalPontos(): void {
    this.showPontosModal = false;
    this.consultaDetalhes = null;
    this.errorMessage = null;
  }

  calcularValorDinheiro(): void {
    if (!this.consultaDetalhes) return;

    const valorTotal = this.consultaDetalhes.valorEmPontos * 5;
    const desconto = this.pontosParaUsar * 5;
    this.valorDinheiro = Math.max(0, valorTotal - desconto);
  }

  confirmarAgendamentoComPontos(): void {
    if (!this.consultaSelecionadaId || !this.pacienteId) {
      this.errorMessage = 'Consulta não selecionada ou ID do paciente inválido';
      return;
    }

    if (this.pontosParaUsar < 0) {
      this.errorMessage = 'A quantidade de pontos não pode ser negativa';
      return;
    }

    if (this.pontosParaUsar > this.saldoPontos) {
      this.errorMessage = 'Saldo de pontos insuficiente';
      return;
    }

    if (this.consultaDetalhes) {
      const valorTotal = this.consultaDetalhes.valorEmPontos * 5;
      if (this.pontosParaUsar * 5 > valorTotal) {
        this.errorMessage = 'Não pode usar mais pontos que o valor da consulta';
        return;
      }
    }

    this.agendarConsulta(this.consultaSelecionadaId, this.pontosParaUsar);

    this.fecharModalPontos();
  }

  filtrarConsultas(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroMedico = input.value.toLowerCase();
    this.aplicarFiltros();
  }

  filtrarPorEspecialidade(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroEspecialidade = select.value;
    this.aplicarFiltros();
  }

  ordenarConsultas(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.ordem = select.value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.consultas];

    if (this.filtroMedico) {
      resultado = resultado.filter(consulta =>
        consulta.profissional.nome.toLowerCase().includes(this.filtroMedico)
      );
    }

    if (this.filtroEspecialidade) {
      resultado = resultado.filter(consulta =>
        consulta.especialidade.nome === this.filtroEspecialidade
      );
    }

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

  agendarConsulta(consultaId: number, pontosUsados: number = 0): void {
    if (!this.pacienteId) {
      this.errorMessage = 'ID do paciente não disponível.';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const agendamento = {
      pacienteId: this.pacienteId,
      consultaId: consultaId,
      pontosUsados: pontosUsados
    };

    console.log('Enviando payload:', agendamento);

    try {
      const headers = this.getAuthHeaders();
      this.http.post('http://localhost:8080/pacientes/agendamentos', agendamento, {
        headers,
        responseType: 'text'
      }).subscribe({
        next: (responseText) => {
          try {
            const response: AgendamentoResponse = JSON.parse(responseText);
            this.successMessage = `Consulta agendada com sucesso!
                                    Pontos utilizados: ${pontosUsados} (R$ ${(pontosUsados * 5).toFixed(2)})
                                    Valor em dinheiro: R$ ${this.valorDinheiro.toFixed(2)}`;
          } catch (e) {
            this.successMessage = 'Agendamento realizado com sucesso!';
          }

          // Saldo local do componente é atualizado
          this.saldoPontos -= pontosUsados;
          // NOTIFICA O PACIENTESERVICE para que o Dashboard seja atualizado
          this.pacienteService.atualizarSaldo(this.saldoPontos);

          this.consultaSelecionadaId = null;

          setTimeout(() => {
            this.carregarConsultas();
          }, 1000);
        },
        error: (err) => {
          console.error('Erro ao agendar:', err);

          if (err.status === 401 || err.status === 403) {
            this.errorMessage = 'Sessão expirada ou não autorizada. Faça login novamente.';
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (err.status === 400) {
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

          this.consultaSelecionadaId = null;
          this.carregarConsultas();
        }
      });
    } catch (error: any) {
        console.error('Erro ao preparar requisição de agendamento:', error.message);
        this.errorMessage = error.message;
    }
  }

  converterPontosParaReais(pontos: number): string {
    return (pontos * 5).toFixed(2);
  }

  formatarData(dataHora: string): string {
    return new Date(dataHora).toLocaleString('pt-BR');
  }
}
