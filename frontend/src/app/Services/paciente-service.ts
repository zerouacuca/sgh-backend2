import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth-service.service'; // Assumindo que AuthService está no mesmo nível ou acessível

interface PacienteResponse {
  id: number;
  saldoPontos: number;
  // Adicione outras propriedades conforme necessário
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // BehaviorSubject para o saldo de pontos, inicializado com 0
  private _saldoPontos = new BehaviorSubject<number>(0);
  // Observable público para que outros componentes possam subscrever
  public readonly saldoPontos$: Observable<number> = this._saldoPontos.asObservable();

  private apiBaseUrl = 'http://localhost:8080/pacientes/pacientes';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para carregar o saldo inicial do backend
  carregarSaldoInicial(): Observable<PacienteResponse> {
    const pacienteId = this.authService.getPacienteId();
    if (!pacienteId) {
      // Se não há pacienteId, emite um erro e não prossegue com a requisição
      return throwError(() => new Error('ID do paciente não encontrado. Faça login novamente.'));
    }

    const url = `${this.apiBaseUrl}/${pacienteId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<PacienteResponse>(url, { headers }).pipe(
      tap(response => {
        // Atualiza o BehaviorSubject com o saldo recebido do backend
        this._saldoPontos.next(response.saldoPontos);
      }),
      catchError(error => {
        console.error('Erro ao carregar saldo inicial:', error);
        // Opcional: tratar erros específicos como 401/403 aqui ou no componente que subscreve
        if (error.status === 401 || error.status === 403) {
          this.authService.logout(); // Força logout se a sessão for inválida
        }
        return throwError(() => new Error('Não foi possível carregar o saldo de pontos.'));
      })
    );
  }

  // Método para atualizar o saldo e notificar os subscreventes
  atualizarSaldo(novoSaldo: number): void {
    this._saldoPontos.next(novoSaldo);
  }

  // Método para obter o saldo atual (sem fazer requisição)
  get currentSaldo(): number {
    return this._saldoPontos.getValue();
  }
}