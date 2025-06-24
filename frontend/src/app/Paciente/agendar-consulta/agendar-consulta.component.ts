import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, catchError, forkJoin, of, map, tap } from 'rxjs';

// Interfaces com propriedades opcionais
interface Medico {
  id: number;
  nome: string;
  especialidade: string;
}

interface DiaDisponivel {
  data: Date;
  disponivel: boolean;
}

interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-agendar-consulta',
  templateUrl: './agendar-consulta.component.html',
  styleUrls: ['./agendar-consulta.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class AgendarConsultaComponent implements OnInit {
  @Output() agendamentoConfirmado = new EventEmitter<any>();

  passoAtual = 1;
  especialidades: string[] = [];
  medicos: Medico[] = [];
  medicosFiltrados: Medico[] = [];
  especialidadeSelecionada: string = '';
  medicoSelecionado: number | null = null;
  medicoSelecionadoObj?: Medico;
  mesAtual: Date = new Date();
  diasDoMes: DiaDisponivel[] = [];
  dataSelecionada?: Date;
  horariosDisponiveis: string[] = [];
  horarioSelecionado?: string;
  isLoading = false;
  errorMessage?: string;

  valorConsulta = 150.00;
  saldoPontos = 0;
  pontosUsados = 0;
  desconto = 0;
  valorTotal = this.valorConsulta;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.carregarDadosIniciais();
    this.gerarCalendario();
  }

  fecharModal(): void {
    this.router.navigate(['/']);
  }

  avancarParaPasso(passo: number): void {
    if (passo === 2 && this.medicoSelecionado) {
      this.medicoSelecionadoObj = this.getMedicoSelecionadoObj();
      this.gerarCalendario();
    }

    if (passo === 3) {
      this.calcularDesconto();
    }

    this.passoAtual = passo;
  }

  voltarParaPasso(passo: number): void {
    this.passoAtual = passo;
  }

  private carregarDadosIniciais(): void {
    this.isLoading = true;
    this.errorMessage = undefined;

    forkJoin({
      especialidades: this.carregarEspecialidades(),
      medicos: this.carregarMedicos(),
      saldoPontos: this.carregarSaldoPontos()
    }).pipe(
      catchError((err) => {
        console.error('Erro ao carregar dados', err);
        this.errorMessage = 'Erro ao carregar dados. Tente novamente mais tarde.';
        this.isLoading = false;
        return of({
          especialidades: [],
          medicos: [],
          saldoPontos: 0
        });
      })
    ).subscribe(({ especialidades, medicos, saldoPontos }) => {
      this.especialidades = especialidades;
      this.medicos = medicos;
      this.saldoPontos = saldoPontos;
      this.isLoading = false;
    });
  }

  private carregarEspecialidades(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>('https://api-gateway/especialidades').pipe(
      tap(response => {
        if (!response.success) throw new Error(response.message);
      }),
      map(response => response.data || [])
    );
  }

  private carregarMedicos(): Observable<Medico[]> {
    return this.http.get<ApiResponse<Medico[]>>('https://api-gateway/medicos').pipe(
      tap(response => {
        if (!response.success) throw new Error(response.message);
      }),
      map(response => response.data || [])
    );
  }

  private carregarSaldoPontos(): Observable<number> {
    return this.http.get<ApiResponse<number>>('https://api-gateway/usuarios/saldo-pontos').pipe(
      tap(response => {
        if (!response.success) throw new Error(response.message);
      }),
      map(response => response.data || 0)
    );
  }

  getMedicoSelecionadoObj(): Medico | undefined {
    return this.medicos.find(m => m.id === this.medicoSelecionado);
  }

  aoSelecionarEspecialidade(): void {
    this.medicosFiltrados = this.medicos.filter(m =>
      m.especialidade === this.especialidadeSelecionada
    );
    this.medicoSelecionado = null;
  }

  selecionarData(data: Date): void {
    this.dataSelecionada = data;
    this.carregarHorariosDisponiveis();
    this.horarioSelecionado = undefined;
  }

  private carregarHorariosDisponiveis(): void {
    if (!this.medicoSelecionado || !this.dataSelecionada) return;

    this.isLoading = true;
    const medicoId = this.medicoSelecionado;
    const data = this.dataSelecionada.toISOString().split('T')[0];

    this.http.get<ApiResponse<string[]>>(
      `https://api-gateway/agendamentos/horarios-disponiveis?medicoId=${medicoId}&data=${data}`
    ).pipe(
      catchError((err) => {
        console.error('Erro ao carregar horários', err);
        this.errorMessage = 'Erro ao carregar horários disponíveis';
        return of({ success: false, data: [] } as ApiResponse<string[]>);
      })
    ).subscribe(response => {
      this.horariosDisponiveis = response.success ? (response.data || []) : [];
      this.isLoading = false;
    });
  }

  selecionarHorario(horario: string): void {
    this.horarioSelecionado = horario;
  }

  calcularDesconto(): void {
    this.desconto = Math.min(this.pontosUsados * 5, this.valorConsulta);
    this.valorTotal = this.valorConsulta - this.desconto;
  }

  gerarCalendario(): void {
    const inicio = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth(), 1);
    const fim = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 0);
    this.diasDoMes = [];

    for (let dia = 1; dia <= fim.getDate(); dia++) {
      const data = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth(), dia);
      const disponivel = data.getDay() !== 0;
      this.diasDoMes.push({ data, disponivel });
    }
  }

  mesAnterior(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() - 1, 1);
    this.gerarCalendario();
  }

  proximoMes(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
    this.gerarCalendario();
  }

  confirmarAgendamento(): void {
    if (!this.validarAgendamento()) return;

    const agendamento = {
      medicoId: this.medicoSelecionado,
      data: this.dataSelecionada?.toISOString(),
      horario: this.horarioSelecionado,
      pontosUsados: this.pontosUsados
    };

    this.isLoading = true;

    this.http.post<ApiResponse<any>>(
      'https://api-gateway/agendamentos',
      agendamento
    ).pipe(
      catchError((err) => {
        console.error('Erro ao agendar', err);
        this.isLoading = false;
        return of({
          success: false,
          message: 'Erro ao confirmar agendamento'
        } as ApiResponse<any>);
      })
    ).subscribe(response => {
      this.isLoading = false;

      // Verificação segura das propriedades
      if (response.success && response.data) {
        this.agendamentoConfirmado.emit({
          ...agendamento,
          codigo: response.data.codigoAgendamento
        });
        this.router.navigate(['/']);
      } else {
        this.errorMessage = response.message || 'Erro desconhecido';
      }
    });
  }

  private validarAgendamento(): boolean {
    return !!(
      this.medicoSelecionado &&
      this.dataSelecionada &&
      this.horarioSelecionado
    );
  }
}
