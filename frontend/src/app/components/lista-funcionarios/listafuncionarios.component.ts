import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderfuncionarioComponent } from '../header-funcionario/headerfuncionario.component';

@Component({
  selector: 'app-listafuncionarios',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule, HeaderfuncionarioComponent],
  templateUrl: './listafuncionarios.component.html',
  styleUrls: ['./listafuncionarios.component.css']
})
export class ListaFuncionariosComponent implements OnInit {
  funcionarios: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.funcionarios = [
      {
        nome: 'Ana Souza',
        cpf: '123.456.789-00',
        email: 'ana.souza@example.com',
        telefone: '(11) 91234-5678',
        status: 'ATIVO'
      },
      {
        nome: 'Carlos Pereira',
        cpf: '987.654.321-00',
        email: 'carlos.pereira@example.com',
        telefone: '(21) 99876-5432',
        status: 'ATIVO'
      },
      {
        nome: 'Mariana Lima',
        cpf: '111.222.333-44',
        email: 'mariana.lima@example.com',
        telefone: '(31) 98888-7777',
        status: 'ATIVO'
      }
    ];
  }

  atualizar(funcionario: any) {
    this.router.navigate(['/funcionario/atualizar']);
  }

  toggleStatus(funcionario: any) {
    if (funcionario.status === 'ATIVO') {
      funcionario.status = 'INATIVO';
      alert(`Funcionário ${funcionario.nome} foi inativado.`);
    } else {
      funcionario.status = 'ATIVO';
      alert(`Funcionário ${funcionario.nome} foi ativado.`);
    }
  }
}
