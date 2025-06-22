require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const agendamentosRoutes = require('./routes/agendamentos');
const consultasRoutes = require('./routes/consultas');
const especialidadesRoutes = require('./routes/especialidades');
const profissionaisRoutes = require('./routes/profissionais');
const salasRoutes = require('./routes/salas');
const agendamentosPacienteRoutes = require('./routes/agendamentosPaciente');
const pacientesPublicRouter = require('./routes/pacientesPublic');
const pacientesProtectedRouter = require('./routes/pacientesProtected');

const authorize = require('./middleware/authorization'); // autorização simples por perfil
const authorizeByMethod = require('./middleware/authorizationByMethod'); // autorização por método HTTP

const app = express();
app.use(cors());
app.use(express.json());

// Rotas públicas (auth)
app.use('/auth', authRoutes);

// Consultas - acesso amplo para todos os perfis
app.use(
  '/consultas',
  authorize(['ADMIN', 'RECEPCAO', 'MEDICO', 'PACIENTE']),
  consultasRoutes
);

// Agendamentos - acesso mais restrito
app.use(
  '/agendamentos',
  authorize(['ADMIN', 'RECEPCAO', 'MEDICO']),
  agendamentosRoutes
);

// Especialidades - controle refinado por método HTTP
app.use(
  '/especialidades',
  authorizeByMethod({
    GET: ['ADMIN', 'RECEPCAO', 'MEDICO', 'PACIENTE'],
    POST: ['ADMIN'],
    DELETE: ['ADMIN'],
  }),
  especialidadesRoutes
);

// Profissionais - controle refinado por método HTTP
app.use(
  '/profissionais',
  authorizeByMethod({
    GET: ['ADMIN', 'RECEPCAO', 'MEDICO', 'PACIENTE'],
    POST: ['ADMIN'],
    DELETE: ['ADMIN'],
  }),
  profissionaisRoutes
);

// Salas - controle refinado por método HTTP
app.use(
  '/salas',
  authorizeByMethod({
    GET: ['ADMIN', 'RECEPCAO', 'MEDICO', 'PACIENTE'],
    POST: ['ADMIN'],
    DELETE: ['ADMIN']
  }),
  salasRoutes
);

// Agendamentos ms-paciente - só pacientes podem agendar
app.use(
  '/agendamentos-paciente',
  authorize(['PACIENTE']),
  agendamentosPacienteRoutes
);


// Pacientes públicos: cadastro e busca por CPF/email
app.use('/pacientes', pacientesPublicRouter);
// Pacientes protegidos: edição, exclusão, transações
app.use(
  '/pacientes',
  authorizeByMethod({
    GET: ['ADMIN', 'RECEPCAO'], // /pacientes, /pacientes/:id
    PUT: ['ADMIN'],
    DELETE: ['ADMIN'],
    POST: ['ADMIN'], // para /pacientes/:id/transacoes
  }),
  pacientesProtectedRouter
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
