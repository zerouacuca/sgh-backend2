import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HeaderfuncionarioComponent } from '../header-funcionario/headerfuncionario.component';

@Component({
  standalone: true,
  selector: 'app-atualizar-funcionario',
  templateUrl: './atualizarfuncionario.component.html',
  styleUrls: ['./atualizarfuncionario.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective, HeaderfuncionarioComponent],
  providers: [provideNgxMask()],
})
export class AtualizarFuncionarioComponent {
  funcionario = {
    nome: '',
    cpf: '123.456.789-00', // CPF fixo fictício
    email: '',
    telefone: '',
    senha: '',
  };

  onSubmit(form: NgForm) {
    if (!form.valid) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    alert('Funcionário atualizado com sucesso!\n' + JSON.stringify(this.funcionario));
  }

  limpar(form: NgForm) {
    // Limpa todos os campos menos o cpf
    const cpfFixo = this.funcionario.cpf;
    form.resetForm({ cpf: cpfFixo });
    this.funcionario.cpf = cpfFixo; // garante que cpf não seja apagado
  }
}
