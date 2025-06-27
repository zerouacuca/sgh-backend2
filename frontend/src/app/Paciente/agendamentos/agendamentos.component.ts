import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  agendamentos: any[] = [];
  filtroStatus: string = 'TODOS';
  pacienteId: number | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  private baseUrl = 'http://localhost:8080/pacientes/agendamentos';

  ngOnInit(): void {
    const pacienteIdStr = localStorage.getItem('paciente_id');

    if (pacienteIdStr && !isNaN(Number(pacienteIdStr))) {
      this.pacienteId = parseInt(pacienteIdStr, 10);
      this.carregarAgendamentos();
    } else {
      this.errorMessage = 'ID do paciente inválido ou não encontrado';
      this.isLoading = false;
      console.error('ID do paciente não encontrado no localStorage');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarAgendamentos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<any[]>(`${this.baseUrl}/paciente/${this.pacienteId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: dados => {
          this.agendamentos = dados.map(ag => this.processarAgendamento(ag));
          this.ordenarAgendamentos();
          this.isLoading = false;
        },
        error: err => {
          console.error('Erro ao buscar agendamentos:', err);
          this.errorMessage = 'Erro ao carregar agendamentos. Tente novamente mais tarde.';
          this.isLoading = false;
        }
      });
  }

  private processarAgendamento(agendamento: any): any {
    const dataConsulta = new Date(agendamento.consulta.dataHora);
    const dataLocal = new Date(dataConsulta.getTime() - dataConsulta.getTimezoneOffset() * 60000);

    return {
      id: agendamento.id,
      dataHora: dataLocal.toISOString(),
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

    this.http.put(`${this.baseUrl}/${agendamento.id}/cancelar`, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.carregarAgendamentos(),
        error: err => {
          console.error('Erro ao cancelar agendamento:', err);
          alert('Erro ao cancelar agendamento. Tente novamente.');
        }
      });
  }

  checkIn(agendamento: any): void {
    this.http.post(`${this.baseUrl}/checkin/${agendamento.id}`, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.carregarAgendamentos(),
        error: err => {
          console.error('Erro ao fazer check-in:', err);
          alert('Erro ao fazer check-in. Tente novamente.');
        }
      });
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
