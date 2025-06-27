import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'; // Importa HttpHeaders
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../Services/auth-service.service'; // Importa o AuthService

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private authService = inject(AuthService); // Injeta o AuthService
  private destroy$ = new Subject<void>();

  agendamentos: any[] = [];
  filtroStatus: string = 'TODOS';
  pacienteId: number | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  private baseUrl = 'http://localhost:8080/pacientes/agendamentos';

  ngOnInit(): void {
    // A validação do pacienteIdStr é importante aqui.
    // Em um cenário real, você também pode querer obter o pacienteId do token JWT
    // após o login, em vez de depender apenas do localStorage diretamente.
    const pacienteIdStr = localStorage.getItem('paciente_id');

    if (pacienteIdStr && !isNaN(Number(pacienteIdStr))) {
      this.pacienteId = parseInt(pacienteIdStr, 10);
      this.carregarAgendamentos();
    } else {
      this.errorMessage = 'ID do paciente inválido ou não encontrado. Faça login novamente.';
      this.isLoading = false;
      console.error('ID do paciente não encontrado no localStorage ou inválido.');
      // Opcional: Redirecionar para a página de login se o ID do paciente for crítico
      // this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Novo método para obter os cabeçalhos com o token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Obtém o token do AuthService
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Adiciona o token JWT
      });
    } else {
      // Se o token não existir, você pode querer lançar um erro ou redirecionar
      this.errorMessage = 'Token de autenticação ausente. Faça login novamente.';
      // Opcional: Redirecionar para a tela de login
      // this.router.navigate(['/login']);
      throw new Error('Token de autenticação não encontrado.');
    }
  }

  carregarAgendamentos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const headers = this.getAuthHeaders(); // Obtém os cabeçalhos com o token
      this.http.get<any[]>(`${this.baseUrl}/paciente/${this.pacienteId}`, { headers }) // Passa os cabeçalhos
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: dados => {
            this.agendamentos = dados.map(ag => this.processarAgendamento(ag));
            this.ordenarAgendamentos();
            this.isLoading = false;
          },
          error: err => {
            console.error('Erro ao buscar agendamentos:', err);
            // Verifica se o erro é de autenticação (401)
            if (err.status === 401 || err.status === 403) {
                this.errorMessage = 'Sessão expirada ou não autorizada. Faça login novamente.';
                // Opcional: Limpar token e redirecionar para login
                this.authService.logout();
                // this.router.navigate(['/login']);
            } else {
                this.errorMessage = 'Erro ao carregar agendamentos. Tente novamente mais tarde.';
            }
            this.isLoading = false;
          }
        });
    } catch (error: any) {
        console.error('Erro ao preparar requisição:', error.message);
        this.errorMessage = error.message;
        this.isLoading = false;
    }
  }

  private processarAgendamento(agendamento: any): any {
    const dataConsulta = new Date(agendamento.consulta.dataHora);
    // Ajuste para fuso horário se necessário, mas geralmente o backend deve retornar UTC ou com fuso
    // A linha abaixo tenta ajustar para o fuso horário local, o que pode ser problemático
    // se o backend já estiver enviando datas ajustadas ou se houver um fuso fixo para a aplicação.
    // Considere remover .getTimezoneOffset() se as datas aparecerem incorretas.
    const dataLocal = new Date(dataConsulta.getTime() - dataConsulta.getTimezoneOffset() * 60000);

    return {
      id: agendamento.id,
      dataHora: dataLocal.toISOString(), // Ou formatar para exibição aqui
      status: agendamento.status,
      codigo: agendamento.id,
      medico: agendamento.consulta.profissional.nome,
      especialidade: agendamento.consulta.especialidade.nome,
      dataOriginal: agendamento.consulta.dataHora
    };
  }

  private ordenarAgendamentos(): void {
    this.agendamentos.sort((a, b) =>
      new Date(a.dataOriginal).getTime() - new Date(b.dataOriginal).getTime()
    );
  }

  get agendamentosFiltrados(): any[] {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    switch (this.filtroStatus) {
      case 'TODOS':
        return this.agendamentos;
      case 'FUTUROS':
        return this.agendamentos.filter(a =>
          new Date(a.dataOriginal) >= hoje &&
          (a.status === 'CRIADO' || a.status === 'CHECKIN')
        );
      case 'REALIZADOS':
        return this.agendamentos.filter(a =>
          a.status === 'REALIZADO' ||
          a.status === 'COMPARECEU' ||
          a.status === 'FALTOU'
        );
      case 'CANCELADOS':
        return this.agendamentos.filter(a => a.status === 'CANCELADO');
      default:
        return this.agendamentos;
    }
  }

  cancelar(agendamento: any): void {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      const headers = this.getAuthHeaders(); // Obtém os cabeçalhos com o token
      this.http.put(`${this.baseUrl}/${agendamento.id}/cancelar`, {}, { headers }) // Passa os cabeçalhos
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.carregarAgendamentos(),
          error: err => {
            console.error('Erro ao cancelar agendamento:', err);
            if (err.status === 401 || err.status === 403) {
                alert('Sessão expirada ou não autorizada. Faça login novamente.');
                this.authService.logout();
            } else {
                alert('Erro ao cancelar agendamento. Tente novamente.');
            }
          }
        });
    } catch (error: any) {
        console.error('Erro ao preparar requisição:', error.message);
        alert(error.message);
    }
  }

  checkIn(agendamento: any): void {
    try {
      const headers = this.getAuthHeaders(); // Obtém os cabeçalhos com o token
      this.http.post(`${this.baseUrl}/checkin/${agendamento.id}`, {}, { headers }) // Passa os cabeçalhos
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.carregarAgendamentos(),
          error: err => {
            console.error('Erro ao fazer check-in:', err);
            if (err.status === 401 || err.status === 403) {
                alert('Sessão expirada ou não autorizada. Faça login novamente.');
                this.authService.logout();
            } else {
                alert('Erro ao fazer check-in. Tente novamente.');
            }
          }
        });
    } catch (error: any) {
        console.error('Erro ao preparar requisição:', error.message);
        alert(error.message);
    }
  }

  podeCancelar(agendamento: any): boolean {
    return agendamento.status === 'CRIADO' || agendamento.status === 'CHECKIN';
  }

  podeFazerCheckIn(agendamento: any): boolean {
    if (agendamento.status !== 'CRIADO') return false;

    const agora = new Date();
    const dataConsulta = new Date(agendamento.dataOriginal);
    if (dataConsulta <= agora) return false;

    const diffHoras = (dataConsulta.getTime() - agora.getTime()) / (1000 * 60 * 60);
    return diffHoras <= 48;
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'CRIADO': 'Agendado',
      'CHECKIN': 'Check-in realizado',
      'COMPARECEU': 'Compareceu',
      'FALTOU': 'Faltou',
      'REALIZADO': 'Realizado',
      'CANCELADO': 'Cancelado'
    };
    return statusMap[status] || status;
  }
}