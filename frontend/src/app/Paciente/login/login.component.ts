import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth-service.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, NgbAlert, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  credentials = { email: '', senha: '' };
  mensagemErro: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  async onSubmit() {
    try {
      this.mensagemErro = null;

      if (!this.validarEmail(this.credentials.email)) {
        this.mensagemErro = 'Formato de e-mail inválido!';
        return;
      }

      // Tenta fazer login (sem validação de formato da senha)
      const loginSuccess = await this.authService.login(
        this.credentials.email,
        this.credentials.senha
      );

      if (loginSuccess) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.mensagemErro = 'Credenciais inválidas!';
      }

    } catch (erro: any) {
      this.tratarErro(erro);
    }
  }

  private validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email.trim());
  }

  private tratarErro(erro: any): void {
    console.error('Erro no login:', erro);

    if (erro.status === 401) {
      this.mensagemErro = 'Credenciais inválidas!';
    } else if (erro.status === 404) {
      this.mensagemErro = 'Usuário não encontrado!';
    } else {
      this.mensagemErro = 'Erro na comunicação com o servidor. Tente novamente.';
    }

    setTimeout(() => this.mensagemErro = null, 5000);
  }

  onCadastrar() {
    this.router.navigate(['/cadastro']);
  }
}
