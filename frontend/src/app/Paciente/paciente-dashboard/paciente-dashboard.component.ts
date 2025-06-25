import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../Services/auth-service.service';

interface PacienteResponse {
  id: number;
  saldoPontos: number;
  // Adicione outras propriedades conforme necessário
}

@Component({
  selector: 'app-paciente-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './paciente-dashboard.component.html',
  styleUrls: ['./paciente-dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  saldoPontos: number = 0;
  carregandoSaldo: boolean = true;

  constructor(
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.carregarSaldoPontos();
  }

  private async carregarSaldoPontos(): Promise<void> {
    try {
      this.carregandoSaldo = true;
      const pacienteId = this.authService.getPacienteId();

      if (!pacienteId) {
        throw new Error('ID do paciente não encontrado');
      }

      const url = `http://localhost:8081/pacientes/${pacienteId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      });

      const response = await this.http.get<PacienteResponse>(url, { headers }).toPromise();

      if (response) {
        this.saldoPontos = response.saldoPontos;
      }

    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    } finally {
      this.carregandoSaldo = false;
    }
  }

  formatarSaldo(saldo: number): string {
    return Math.abs(saldo).toString();
  }
}
