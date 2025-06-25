import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { authGuard } from './app/Services/auth-guard.service';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/Paciente/login/login.component';
import { CadastroComponent } from './app/Paciente/cadastro/cadastro.component';
import { CompraPontosComponent } from './app/Paciente/compra-pontos/compra-pontos.component';
import { AgendarConsultaComponent } from './app/Paciente/agendar-consulta/agendar-consulta.component';
import { AgendamentosComponent } from './app/Paciente/agendamentos/agendamentos.component';
import { DashboardComponent } from './app/Paciente/paciente-dashboard/paciente-dashboard.component';

// Funcionario
import { PgFuncionarioComponent } from './app/components/pg-funcionario/pg-funcionario.component';
import { CadastrarFuncionarioComponent } from './app/components/cadastrar-funcionario/cadastrarfuncionario.component';
import { ListaFuncionariosComponent } from './app/components/lista-funcionarios/listafuncionarios.component';
import { AtualizarFuncionarioComponent } from './app/components/atualizar-funcionario/atualizarfuncionario.component';
import { CadastrarConsultaComponent } from './app/components/cadastrar-consulta/cadastrarconsulta.component';



export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },

  { path: 'funcionario', component: PgFuncionarioComponent },
{ path: 'funcionario/cadastrar', component: CadastrarFuncionarioComponent },
{ path: 'funcionario/lista', component: ListaFuncionariosComponent },
{ path: 'funcionario/atualizar', component: AtualizarFuncionarioComponent },
{ path: 'cadastrar-consulta', component: CadastrarConsultaComponent },


  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'agendamentos', pathMatch: 'full' }, // rota padrão dentro do dashboard
      { path: 'compra', component: CompraPontosComponent },
      { path: 'agendamento', component: AgendarConsultaComponent },
      { path: 'agendamentos', component: AgendamentosComponent },
    ]
  },

  { path: '**', redirectTo: '/login' },
];


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideNgxMask(),
  ],
}).catch(err => console.error(err));
