const express = require('express');
const app = express();



const publicRoutes = require('./routes/publicRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');




// Ajustado: importa o middleware auth.js
const authMiddleware = require('./middleware/auth'); // Middleware para validar JWT e setar req.user
const perfilMiddleware = require('./middleware/authorization'); // Middleware para verificar perfil


app.use(express.json());

// Rotas públicas — não precisa de autenticação
app.use('/public', publicRoutes);

// Rotas para funcionários — precisa estar autenticado e ter perfil FUNCIONARIO
app.use(
  '/funcionarios',
  authMiddleware,
  perfilMiddleware('FUNCIONARIO'),
  funcionarioRoutes
);

// Rotas para pacientes — precisa estar autenticado e ter perfil PACIENTE
app.use(
  '/pacientes',
  authMiddleware,
  perfilMiddleware('PACIENTE'),
  pacienteRoutes
);

// Middleware para tratar rotas não encontradas (deve estar após todas as rotas)
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Porta configurável, padrão 8080 (ajuste conforme sua necessidade)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
