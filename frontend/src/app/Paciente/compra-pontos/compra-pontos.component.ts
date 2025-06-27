import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth-service.service';
import { PacienteService } from '../../Services/paciente-service'; // Importa PacienteService
import { takeUntil, Subject } from 'rxjs'; // Para desinscrição e takeUntil

interface Endereco {
  id: number;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Transacao {
  id: number;
  origem: string;
  tipo: string;
  valor: number; // Agora representa pontos diretamente
  dataHora: string;
}

interface Paciente {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  saldoPontos: number;
  endereco: Endereco;
  transacoes: Transacao[];
}

@Component({
  selector: 'app-compra-pontos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compra-pontos.component.html',
  styleUrls: ['./compra-pontos.component.css']
})
export class CompraPontosComponent implements OnInit {
  @ViewChild('quantidadePontos') quantidadePontos!: ElementRef<HTMLInputElement>;

  transacoes: Transacao[] = [];
  total: number = 0;
  carregando: boolean = false;
  private apiBaseUrl = 'http://localhost:8080/pacientes/pacientes';
  saldoPontos: number = 0; // Este saldo será apenas local, o serviço gerencia o global.
  private destroy$ = new Subject<void>(); // Para desinscrever observáveis

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private pacienteService: PacienteService // Injeta PacienteService
  ) { }

  ngOnInit(): void {
    this.carregarHistorico();

    // Opcional: subscrever ao saldo do serviço para manter este componente sincronizado
    this.pacienteService.saldoPontos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(saldo => {
        this.saldoPontos = saldo; // Atualiza o saldo local quando o serviço emite uma mudança
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async carregarHistorico(): Promise<void> {
    try {
      this.carregando = true;
      const pacienteId = this.obterPacienteId();
      const url = `${this.apiBaseUrl}/${pacienteId}`;

      const paciente = await this.http.get<Paciente>(
        url,
        { headers: this.getHeaders() }
      ).toPromise();

      if (paciente) {
        this.transacoes = paciente.transacoes ? paciente.transacoes.reverse() : [];
        // O saldo principal agora é gerenciado pelo PacienteService.
        // Chamada explícita para carregar o saldo no serviço se ainda não estiver carregado.
        if (this.pacienteService.currentSaldo === 0 && paciente.saldoPontos !== 0) {
           this.pacienteService.atualizarSaldo(paciente.saldoPontos);
        }
      }

    } catch (error) {
      this.handleError(error);
    } finally {
      this.carregando = false;
    }
  }

  async processarCompra(): Promise<void> {
    try {
      this.carregando = true;
      const pontosComprados = this.validarEntrada();
      const pacienteId = this.obterPacienteId();

      const payload = {
        origem: "COMPRA",
        tipo: "CREDITO",
        valor: pontosComprados // Corrigido para pontosComprados
      };

      await this.enviarParaApi(pacienteId, payload);

      // Notifica o PacienteService sobre a mudança no saldo
      const novoSaldo = this.pacienteService.currentSaldo + pontosComprados;
      this.pacienteService.atualizarSaldo(novoSaldo);

      await this.carregarHistorico(); // Recarrega o histórico de transações

      this.limparFormulario();
      alert('Compra realizada com sucesso!');

    } catch (error) {
      this.handleError(error);
    } finally {
      this.carregando = false;
    }
  }

  private obterPacienteId(): number {
    const pacienteId = this.authService.getPacienteId();
    if (!pacienteId) {
      throw new Error('ID do paciente não encontrado. Faça login novamente.');
    }
    return pacienteId;
  }

  private async enviarParaApi(pacienteId: number, payload: any): Promise<void> {
    const url = `${this.apiBaseUrl}/${pacienteId}/transacoes`;

    await this.http.post(
      url,
      payload,
      {
        headers: this.getHeaders(),
        responseType: 'text'
      }
    ).toPromise();
  }

  private validarEntrada(): number {
    const valor = this.quantidadePontos.nativeElement.value;
    const pontos = Number(valor);

    if (isNaN(pontos)) {
      throw new Error('Valor inválido para pontos');
    }
    if (pontos <= 0) {
      throw new Error('A quantidade de pontos deve ser maior que zero');
    }
    if (!Number.isInteger(pontos)) {
      throw new Error('A quantidade de pontos deve ser um valor inteiro');
    }

    return pontos;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  private handleError(error: any): void {
    console.error('Erro:', error);
    if (error.status === 401 || error.status === 403) {
      alert('Sessão expirada ou não autorizada. Faça login novamente.');
      this.authService.logout();
      // Opcional: redirecionar para a página de login
      // this.router.navigate(['/login']);
    } else {
      alert(error.message || 'Erro ao processar a compra');
    }
  }

  // ... (métodos auxiliares)

  atualizarTotal(valor: string): void {
    const pontos = Number(valor) || 0;
    this.total = pontos * 5;
  }

  private limparFormulario(): void {
    this.quantidadePontos.nativeElement.value = '';
    this.total = 0;
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  formatarData(dataHora: string): string {
    return new Date(dataHora).toLocaleString('pt-BR');
  }

  pontosParaReais(pontos: number): string {
    return this.formatarMoeda(pontos * 5);
  }
}