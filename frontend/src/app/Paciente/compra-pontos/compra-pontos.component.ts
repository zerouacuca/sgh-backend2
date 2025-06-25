import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth-service.service';

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
  private apiBaseUrl = 'http://localhost:8081/pacientes';
  saldoPontos: number = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.carregarHistorico();
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
        this.saldoPontos = paciente.saldoPontos;
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
      const pontos = this.validarEntrada();
      const pacienteId = this.obterPacienteId();

      const payload = {
        origem: "COMPRA",
        tipo: "CREDITO",
        valor: pontos
      };

      await this.enviarParaApi(pacienteId, payload);
      this.saldoPontos += pontos;

      await this.carregarHistorico();

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
    alert(error.message || 'Erro ao processar a compra');
  }

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
