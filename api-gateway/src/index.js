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
const pacientesRoutes = require('./routes/pacientes');

const authorize = require('./middleware/authorization');
const authorizeByMethod = require('./middleware/authorizationByMethod');

const app = express();
app.use(cors({
  origin: ['http://localhost:4200'], // ou outras origens autorizadas
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// R01/R02 - Autenticação e cadastro de paciente
app.use('/auth', authRoutes);

// R03/R05/R06/R07 - Consultas (visualização e manipulação)
app.use(
  '/consultas',
  authorizeByMethod({
    GET: ['PACIENTE', 'FUNCIONARIO'],
    POST: ['FUNCIONARIO'],       // R12 - Criar consulta
    PUT: ['FUNCIONARIO']         // R09, R10, R11 - Confirmar, cancelar, realizar
  }),
  consultasRoutes
);

// R08~R11 - Agendamentos: apenas funcionários manipulam diretamente
app.use(
  '/agendamentos',
  authorize(['FUNCIONARIO']),
  agendamentosRoutes
);

// R05 - Paciente agenda consulta
app.use(
  '/agendamentos-paciente',
  authorize(['PACIENTE']),
  agendamentosPacienteRoutes
);

// R13~R15 - CRUD de profissionais
app.use(
  '/profissionais',
  authorizeByMethod({
    GET: ['PACIENTE', 'FUNCIONARIO'],
    POST: ['FUNCIONARIO'],
    DELETE: ['FUNCIONARIO']
  }),
  profissionaisRoutes
);

// R12 - CRUD de salas
app.use(
  '/salas',
  authorizeByMethod({
    GET: ['PACIENTE', 'FUNCIONARIO'],
    POST: ['FUNCIONARIO'],
    DELETE: ['FUNCIONARIO']
  }),
  salasRoutes
);

// R05 - Listagem e filtro de especialidades
app.use(
  '/especialidades',
  authorizeByMethod({
    GET: ['PACIENTE', 'FUNCIONARIO'],
    POST: ['FUNCIONARIO'],
    DELETE: ['FUNCIONARIO']
  }),
  especialidadesRoutes
);

// R01 - Cadastro público de paciente
// R03/R04/R06 - Manipulação de pontos, histórico, etc.
app.use(
  '/pacientes',
  authorizeByMethod({
    GET: ['PACIENTE', 'FUNCIONARIO'],
    POST: [], // Cadastro público
    PUT: ['FUNCIONARIO'],
    DELETE: ['FUNCIONARIO']
  }),
  pacientesRoutes
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
