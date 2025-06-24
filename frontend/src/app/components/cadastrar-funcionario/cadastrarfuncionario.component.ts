import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HeaderfuncionarioComponent } from '../header-funcionario/headerfuncionario.component';

@Component({
  standalone: true,
  selector: 'app-cadastrar-funcionario',
  templateUrl: './cadastrarfuncionario.component.html',
  styleUrls: ['./cadastrarfuncionario.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective, HeaderfuncionarioComponent],
  providers: [provideNgxMask()],
})
export class CadastrarFuncionarioComponent {
  funcionario = {
    nome: '',
    cpf: '',
    email: '',
    telefone: ''
  };

  onSubmit(form: NgForm) {
    if (!form.valid) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    alert('Funcionário cadastrado com sucesso!\n' + JSON.stringify(this.funcionario));
    form.resetForm();
  }
}
