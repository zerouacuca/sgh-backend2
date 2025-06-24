import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HeaderfuncionarioComponent } from '../header-funcionario/headerfuncionario.component';

@Component({
  standalone: true,
  selector: 'app-cadastrar-consulta',
  templateUrl: './cadastrarconsulta.component.html',
  styleUrls: ['./cadastrarconsulta.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective, HeaderfuncionarioComponent],
  providers: [provideNgxMask()],
})
export class CadastrarConsultaComponent {
  consulta = {
    dataHora: '',
    especialidade: '',
    medico: '',
    valor: '',
    vagas: 1
  };

  especialidades = ['CARD', 'DERM', 'PED', 'GINE', 'ORTO'];

  onSubmit(form: NgForm) {
    if (!form.valid) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    alert('Consulta cadastrada com sucesso!\n' + JSON.stringify(this.consulta));
    form.resetForm();
  }
}
