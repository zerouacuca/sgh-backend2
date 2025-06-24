import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent implements OnInit {
  private http = inject(HttpClient);

  agendamentos: any[] = [];
  filtroStatus: string = 'TODOS';

  private apiUrl = 'http://localhost:8080/consultas/minhas';

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: dados => {
        this.agendamentos = dados;
      },
      error: err => console.error('Erro ao buscar agendamentos:', err)
    });
  }

  get agendamentosFiltrados(): any[] {
    if (this.filtroStatus === 'TODOS') {
      return this.agendamentos;
    }
    if (this.filtroStatus === 'FUTUROS') {
      return this.agendamentos.filter(a => a.status === 'CRIADO' || a.status === 'CHECK-IN');
    }
    if (this.filtroStatus === 'REALIZADOS') {
      return this.agendamentos.filter(a => a.status === 'REALIZADO');
    }
    if (this.filtroStatus === 'CANCELADOS') {
      return this.agendamentos.filter(a => a.status === 'CANCELADO');
    }
    return this.agendamentos;
  }

  cancelar(agendamento: any): void {
    this.http.put(`${this.apiUrl}/${agendamento.id}/cancelar`, {}).subscribe({
      next: () => this.carregarAgendamentos(),
      error: err => console.error('Erro ao cancelar agendamento:', err)
    });
  }

  checkIn(agendamento: any): void {
    this.http.put(`${this.apiUrl}/${agendamento.id}/checkin`, {}).subscribe({
      next: () => this.carregarAgendamentos(),
      error: err => console.error('Erro ao fazer check-in:', err)
    });
  }

  podeCancelar(agendamento: any): boolean {
    return agendamento.status === 'CRIADO' || agendamento.status === 'CHECK-IN';
  }

  podeFazerCheckIn(agendamento: any): boolean {
    const agora = new Date();
    const dataConsulta = new Date(agendamento.dataHora || agendamento.data);
    const diffHoras = (dataConsulta.getTime() - agora.getTime()) / 36e5;
    return agendamento.status === 'CRIADO' && diffHoras <= 48 && diffHoras > 0;
  }
}
