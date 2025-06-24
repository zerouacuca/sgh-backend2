import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderfuncionarioComponent } from '../header-funcionario/headerfuncionario.component';

@Component({
  selector: 'app-pg-funcionario',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule, HeaderfuncionarioComponent],
  templateUrl: './pg-funcionario.component.html',
  styleUrls: ['./pg-funcionario.component.css']
})
export class PgFuncionarioComponent implements OnInit {
  consultas: any[] = [];

  ngOnInit(): void {
    const em48Horas = new Date();
    em48Horas.setHours(em48Horas.getHours() + 48);

    this.consultas = [
      {
        id: 1,
        dataHora: new Date(),
        paciente: 'João da Silva',
        especialidade: 'CARD',
        doutor: 'Dr. Fernando Alves',
        status: 'PENDENTE'  // deve começar pendente
      },
      {
        id: 2,
        dataHora: new Date(new Date().getTime() + 1000 * 60 * 60 * 2),
        paciente: 'Maria Oliveira',
        especialidade: 'PED',
        doutor: 'Dra. Beatriz Mendes',
        status: 'PENDENTE'
      },
      {
        id: 3,
        dataHora: new Date(new Date().getTime() + 1000 * 60 * 60 * 30),
        paciente: 'Carlos Souza',
        especialidade: 'DERM',
        doutor: 'Dr. Ricardo Lima',
        status: 'PENDENTE'
      }
    ].filter(c => new Date(c.dataHora) <= em48Horas);

    console.log('Consultas iniciais:', this.consultas.map(c => ({ id: c.id, status: c.status })));
  }

  confirmar(id: number) {
    this.alterarStatus(id, 'COMPARECEU');
  }

  cancelar(id: number) {
    this.alterarStatus(id, 'CANCELADA');
  }

  realizada(id: number) {
    this.alterarStatus(id, 'REALIZADA');
  }

  private alterarStatus(id: number, novoStatus: string) {
    const consulta = this.consultas.find(c => c.id === id);
    if (consulta) {
      consulta.status = novoStatus;
      console.log(`Consulta ${id} status alterado para:`, novoStatus);
    }
  }
}
