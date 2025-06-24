import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-cadastro',
  imports: [FormsModule, NgxMaskDirective, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  usuario = {
    nome: '',
    cpf: '',
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  mensagemErro: string = '';
  mensagemSucesso: string = '';
  cepNaoEncontrado: boolean = false;
  cadastroFormSubmetido: boolean = false;
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;

  constructor(public router: Router, private http: HttpClient) {}

    // Configuração para mostrar asteriscos
  customPattern = {
    '0': {
      pattern: new RegExp('\\d'),
      symbol: '*'
    }
  };

  // Métodos de Validação
  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

    return digitoVerificador2 === parseInt(cpf.charAt(10));
  }

  onCpfBlur() {
    if (this.usuario.cpf && !this.validarCPF(this.usuario.cpf)) {
      this.mensagemErro = 'CPF inválido!';
    } else {
      this.mensagemErro = '';
    }
  }

  private validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email.trim());
  }

  private validarCEP(cep: string): boolean {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
  }

  private validarNumero(numero: string): boolean {
    return /^\d+$/.test(numero);
  }

  private validarFormulario(): boolean {
    this.mensagemErro = '';

    if (!this.usuario.nome || this.usuario.nome.length < 3) {
      this.mensagemErro = 'Nome deve ter pelo menos 3 caracteres!';
      return false;
    }

    if (!this.validarCPF(this.usuario.cpf)) {
      this.mensagemErro = 'CPF inválido!';
      return false;
    }

    if (!this.validarEmail(this.usuario.email)) {
      this.mensagemErro = 'Formato de e-mail inválido!';
      return false;
    }

    if (!this.validarCEP(this.usuario.cep)) {
      this.mensagemErro = 'CEP inválido!';
      return false;
    }

    if (!this.validarNumero(this.usuario.numero)) {
      this.mensagemErro = 'Número inválido!';
      return false;
    }
    return true;
  }

private async enviarParaApiGateway(): Promise<void> {

  const payload = {
    cpf: this.usuario.cpf.replace(/\D/g, ''),
    nome: this.usuario.nome,
    email: this.usuario.email,
    saldoPontos: 0,
    endereco: {
      rua: this.usuario.rua,
      numero: this.usuario.numero,
      cidade: this.usuario.cidade,
      estado: this.usuario.estado,
      cep: this.usuario.cep.replace(/\D/g, '')
    }
  };

  const urlApiGateway = 'http://localhost:8081/pacientes';

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  await lastValueFrom(
    this.http.post(urlApiGateway, payload, httpOptions)
  );
}

  async onSubmit() {
    this.cadastroFormSubmetido = true;
    try {
      if (!this.validarFormulario()) return;

      await this.enviarParaApiGateway();

      this.mensagemSucesso = 'Cadastro realizado com sucesso!';
      this.mensagemErro = '';

      // Limpar formulário após sucesso
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    } catch (erro: any) {
      this.tratarErro(erro);
    }
  }

  // Métodos de tratamento de erros
  private tratarErro(erro: HttpErrorResponse): void {
    console.error('Erro no cadastro:', erro);

    if (erro.status === 409) {
      this.mensagemErro = 'Este e-mail já está cadastrado!';
    } else if (erro.status === 400) {
      this.mensagemErro = 'Dados inválidos no formulário!';
    } else {
      this.mensagemErro = erro.error?.message || 'Erro ao realizar cadastro. Tente novamente.';
    }
  }

  // Integração com viaCEP
  cepTouched: boolean = false;

  async buscarEndereco() {
    this.cepTouched = true;
    const cepLimpo = this.usuario.cep.replace(/\D/g, '');

    if (!this.validarCEP(cepLimpo)) {
      this.cepNaoEncontrado = true;
      this.limparEndereco();
      return;
    }

    try {
      const data = await lastValueFrom(
        this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      );

      if (data.erro) {
        this.mensagemErro = 'CEP não encontrado!';
        this.cepNaoEncontrado = true;
        this.limparEndereco();
      } else {
        this.preencherEndereco(data);
        this.cepNaoEncontrado = false;
        this.mensagemErro = '';
      }
    } catch (erro) {
      this.mensagemErro = 'Erro ao consultar CEP!';
      this.cepNaoEncontrado = true;
      this.limparEndereco();
    }
  }

  private preencherEndereco(data: any): void {
    this.usuario.rua = data.logradouro || '';
    this.usuario.bairro = data.bairro || '';
    this.usuario.cidade = data.localidade || '';
    this.usuario.estado = data.uf || '';
  }

  private limparEndereco(): void {
    this.usuario.rua = '';
    this.usuario.bairro = '';
    this.usuario.cidade = '';
    this.usuario.estado = '';
  }
}
