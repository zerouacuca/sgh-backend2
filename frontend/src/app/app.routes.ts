import { Routes } from '@angular/router';

// Funcionario
import { PgFuncionarioComponent } from './components/pg-funcionario/pg-funcionario.component';
import { CadastrarFuncionarioComponent } from './components/cadastrar-funcionario/cadastrarfuncionario.component';
import { CadastrarConsultaComponent } from './components/cadastrar-consulta/cadastrarconsulta.component';
import { ListaFuncionariosComponent } from './components/lista-funcionarios/listafuncionarios.component';
import { AtualizarFuncionarioComponent } from './components/atualizar-funcionario/atualizarfuncionario.component';

// Paciente
import { authGuard } from './Services/auth-guard.service';
import { LoginComponent } from './Paciente/login/login.component';
import { CadastroComponent } from './Paciente/cadastro/cadastro.component';
import { CompraPontosComponent } from './Paciente/compra-pontos/compra-pontos.component';
import { AgendarConsultaComponent } from './Paciente/agendar-consulta/agendar-consulta.component';
import { AgendamentosComponent } from './Paciente/agendamentos/agendamentos.component';
import { DashboardComponent } from './Paciente/paciente-dashboard/paciente-dashboard.component';

export const routes: Routes = [
  // Redirecionamento inicial
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Autenticação e cadastro
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },

  // Dashboard do paciente com rotas filhas protegidas
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'agendamentos', pathMatch: 'full' },
      { path: 'compra', component: CompraPontosComponent },
      { path: 'agendamento', component: AgendarConsultaComponent },
      { path: 'agendamentos', component: AgendamentosComponent },
    ]
  },

  // Rotas de funcionário
  { path: 'funcionario', component: PgFuncionarioComponent },
  { path: 'funcionario/cadastrar', component: CadastrarFuncionarioComponent },
  { path: 'funcionario/lista', component: ListaFuncionariosComponent },
  { path: 'funcionario/atualizar', component: AtualizarFuncionarioComponent },
  { path: 'cadastrar-consulta', component: CadastrarConsultaComponent },

  // Catch-all
  { path: '**', redirectTo: '/login' },
];
