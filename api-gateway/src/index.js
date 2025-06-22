require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const agendamentosRoutes = require('./routes/agendamentos');
const consultasRoutes = require('./routes/consultas');
const especialidadesRoutes = require('./routes/especialidades');

const authorize = require('./middleware/authorization'); // autorização simples por perfil
const authorizeByMethod = require('./middleware/authorizationByMethod'); // autorização por método HTTP

const app = express();
app.use(cors());
app.use(express.json());

// Rotas públicas (auth)
app.use('/auth', authRoutes);

// Rotas protegidas

// Consultas - todos os perfis podem acessar
app.use('/consultas', authorize(['ADMIN', 'RECEPCAO', 'MEDICO', 'PACIENTE']), consultasRoutes);

// Agendamentos - acesso mais restrito
app.use('/agendamentos', authorize(['ADMIN', 'RECEPCAO', 'MEDICO']), agendamentosRoutes);

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
