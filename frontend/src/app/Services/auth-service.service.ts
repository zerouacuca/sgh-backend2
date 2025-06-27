import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';
  private pacienteIdKey = 'paciente_id'; // Nova chave para armazenar o ID do paciente
  private apiUrl = 'http://localhost:8080/public/auth/login';
  private pacientesUrl = 'http://localhost:8080/pacientes/pacientes/email'; // URL para buscar dados do paciente

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  async login(email: string, senha: string): Promise<boolean> {
    try {
      // 1. Faz login para obter o token
      const tokenResponse: any = await lastValueFrom(
        this.http.post(this.apiUrl, { email, senha })
      );

      const token = tokenResponse.token;
      console.log('Token recebido:', token);

      if (token) {
        this.setToken(token);

        // 2. Busca informações do paciente usando o email
        const paciente = await this.getPacienteByEmail(email);

        if (paciente && paciente.id) {
          // 3. Armazena o ID do paciente no localStorage
          this.setPacienteId(paciente.id);
          this.setUserId(paciente.id); // Mantido para compatibilidade
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Falha no login:', error);
      throw error; // Propaga o erro para tratamento no componente
    }
  }

  // Método para obter dados do paciente pelo email
  private async getPacienteByEmail(email: string): Promise<any> {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      });

      return await lastValueFrom(
        this.http.get<any>(`${this.pacientesUrl}/${email}`, { headers })
      );
    } catch (error) {
      console.error('Erro ao obter dados do paciente:', error);
      throw error;
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setUserId(userId: number): void {
    localStorage.setItem(this.userIdKey, userId.toString());
  }

  // Novo método para armazenar o ID do paciente
  setPacienteId(pacienteId: number): void {
    localStorage.setItem(this.pacienteIdKey, pacienteId.toString());
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): number | null {
    const id = localStorage.getItem(this.userIdKey);
    return id ? Number(id) : null;
  }

  // Novo método para obter o ID do paciente
  getPacienteId(): number | null {
    const id = localStorage.getItem(this.pacienteIdKey);
    return id ? Number(id) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      const expirationDate = payload.exp * 1000;
      return expirationDate < Date.now();
    } catch (e) {
      return true;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.pacienteIdKey);
    this.router.navigate(['/login']);
  }
}
