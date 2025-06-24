import { Routes } from '@angular/router';
import { authGuard } from './Services/auth-guard.service';
import { LoginComponent } from './Paciente/login/login.component';
import { CadastroComponent } from './Paciente/cadastro/cadastro.component';
import { CompraPontosComponent } from './Paciente/compra-pontos/compra-pontos.component';
import { AgendarConsultaComponent } from './Paciente/agendar-consulta/agendar-consulta.component';
import { AgendamentosComponent } from './Paciente/agendamentos/agendamentos.component';
import { DashboardComponent } from './Paciente/paciente-dashboard/paciente-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },

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

  { path: '**', redirectTo: '/login' },
];
