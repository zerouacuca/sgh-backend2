import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Mantido para futuras necessidades, mas não usado diretamente para saldo
import { AuthService } from '../../Services/auth-service.service';
import { PacienteService } from '../../Services/paciente-service'; // Importa PacienteService
import { Subject, takeUntil } from 'rxjs'; // Para gerenciar a desinscrição

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
export class DashboardComponent implements OnInit, OnDestroy {
  saldoPontos: number = 0;
  carregandoSaldo: boolean = true;
  private destroy$ = new Subject<void>(); // Subject para desinscrever observáveis

  constructor(
    public authService: AuthService,
    // private http: HttpClient, // Não é mais necessário para carregar o saldo
    private pacienteService: PacienteService // Injeta o PacienteService
  ) {}

  ngOnInit(): void {
    // Carrega o saldo inicial do PacienteService
    this.pacienteService.carregarSaldoInicial()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.saldoPontos = response.saldoPontos; // O saldo já foi atualizado no serviço
          this.carregandoSaldo = false;
        },
        error: (error) => {
          console.error('Erro ao carregar saldo inicial:', error);
          this.carregandoSaldo = false;
          // O PacienteService já trata o logout em 401/403
          // Pode adicionar uma mensagem de erro na UI se desejar
        }
      });

    // Subscreve a mudanças futuras no saldo de pontos
    this.pacienteService.saldoPontos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(novoSaldo => {
        this.saldoPontos = novoSaldo;
        this.carregandoSaldo = false; // Garante que o spinner desapareça após a primeira carga/atualização
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // O método carregarSaldoPontos() privado não é mais necessário aqui,
  // pois a lógica de carregamento e atualização será centralizada no PacienteService.
  // Se você precisa de um carregamento explícito fora do ngOnInit, crie um método público
  // que chame pacienteService.carregarSaldoInicial() e subscreva a ele.

  formatarSaldo(saldo: number): string {
    return Math.abs(saldo).toString();
  }
}