const express = require('express');
const axios = require('axios');
const router = express.Router();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;           // URL do ms-paciente
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;           // URL do ms-autenticacao
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL; // URL do ms-consulta

// ==========================
// === ms-paciente endpoints ===
// ==========================

// --- Agendamento ---
// POST /agendamentos : Agendar uma consulta
router.post('/agendamentos', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/agendamentos`, req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro ao agendar consulta:", error.message);
    res.status(error.response?.status || 500).send("Erro ao agendar consulta.");
  }
});

// --- Paciente ---
// GET /pacientes : Listar todos pacientes
router.get('/pacientes', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/pacientes`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar pacientes:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar pacientes.");
  }
});

// GET /pacientes/:id : Buscar paciente por ID
router.get('/pacientes/:id', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/pacientes/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao buscar paciente:", error.message);
    res.status(error.response?.status || 500).send("Erro ao buscar paciente.");
  }
});

// GET /pacientes/cpf/:cpf : Buscar paciente por CPF
router.get('/pacientes/cpf/:cpf', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/pacientes/cpf/${req.params.cpf}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao buscar paciente por CPF:", error.message);
    res.status(error.response?.status || 500).send("Erro ao buscar paciente por CPF.");
  }
});

// GET /pacientes/email/:email : Buscar paciente por email
router.get('/pacientes/email/:email', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/pacientes/email/${req.params.email}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao buscar paciente por email:", error.message);
    res.status(error.response?.status || 500).send("Erro ao buscar paciente por email.");
  }
});

// POST /pacientes : Criar paciente
router.post('/pacientes', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/pacientes`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao criar paciente:", error.message);
    res.status(error.response?.status || 500).send("Erro ao criar paciente.");
  }
});

// PUT /pacientes/:id : Atualizar paciente
router.put('/pacientes/:id', async (req, res) => {
  try {
    const response = await axios.put(`${USER_SERVICE_URL}/pacientes/${req.params.id}`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error.message);
    res.status(error.response?.status || 500).send("Erro ao atualizar paciente.");
  }
});

// DELETE /pacientes/:id : Deletar paciente
router.delete('/pacientes/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${USER_SERVICE_URL}/pacientes/${req.params.id}`);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro ao deletar paciente:", error.message);
    res.status(error.response?.status || 500).send("Erro ao deletar paciente.");
  }
});

// POST /pacientes/:id/transacoes : Adicionar transação de pontos para paciente
router.post('/pacientes/:id/transacoes', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/pacientes/${req.params.id}/transacoes`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao adicionar transação:", error.message);
    res.status(error.response?.status || 500).send("Erro ao adicionar transação.");
  }
});

// =============================
// === ms-consulta endpoints ===
// =============================

// --- Agendamento ---
// GET /agendamentos : Listar todos agendamentos
router.get('/agendamentos', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/agendamentos`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar agendamentos.");
  }
});

// GET /agendamentos/consulta/:consultaId : Listar agendamentos por consulta
router.get('/agendamentos/consulta/:consultaId', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/agendamentos/consulta/${req.params.consultaId}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar agendamentos por consulta:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar agendamentos por consulta.");
  }
});

// GET /agendamentos/paciente/:pacienteId : Listar agendamentos por paciente
router.get('/agendamentos/paciente/:pacienteId', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/agendamentos/paciente/${req.params.pacienteId}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar agendamentos por paciente:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar agendamentos por paciente.");
  }
});

// PUT /agendamentos/:id/cancelar : Cancelar agendamento
router.put('/agendamentos/:id/cancelar', async (req, res) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/agendamentos/${req.params.id}/cancelar`);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error.message);
    res.status(error.response?.status || 500).send("Erro ao cancelar agendamento.");
  }
});

// GET /agendamentos/consulta/:consultaId/checkins : Listar agendamentos com status CHECKIN para consulta
router.get('/agendamentos/consulta/:consultaId/checkins', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/agendamentos/consulta/${req.params.consultaId}/checkins`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar checkins por consulta:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar checkins por consulta.");
  }
});

// POST /agendamentos/:id/checkin : Realizar check-in no agendamento
router.post('/checkin/:agendamentoId', async (req, res) => {
  const { agendamentoId } = req.params;
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/checkin/${agendamentoId}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao realizar check-in:", error.message);
    res.status(error.response?.status || 500).send("Erro ao realizar check-in.");
  }
});

// PUT /agendamentos/:id/confirmar-comparecimento : Confirmar comparecimento do agendamento
router.put('/agendamentos/:id/confirmar-comparecimento', async (req, res) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/agendamentos/${req.params.id}/confirmar-comparecimento`);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro ao confirmar comparecimento:", error.message);
    res.status(error.response?.status || 500).send("Erro ao confirmar comparecimento.");
  }
});

// --- Consulta ---
// GET /consultas/profissional/:profissionalId : Listar consultas por profissional
router.get('/consultas/profissional/:profissionalId', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/consultas/profissional/${req.params.profissionalId}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar consultas por profissional:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar consultas por profissional.");
  }
});

// GET /consultas/especialidade/:especialidadeId : Listar consultas por especialidade
router.get('/consultas/especialidade/:especialidadeId', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/consultas/especialidade/${req.params.especialidadeId}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar consultas por especialidade:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar consultas por especialidade.");
  }
});

// POST /consultas/criar : Criar consulta
router.post('/consultas/criar', async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/consultas/criar`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao criar consulta:", error.message);
    res.status(error.response?.status || 500).send("Erro ao criar consulta.");
  }
});

// PUT /consultas/:id/cancelar : Cancelar consulta
router.put('/consultas/:id/cancelar', async (req, res) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/consultas/${req.params.id}/cancelar`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao cancelar consulta:", error.message);
    res.status(error.response?.status || 500).send("Erro ao cancelar consulta.");
  }
});

// PUT /consultas/:id/finalizar : Finalizar consulta
router.put('/consultas/:id/finalizar', async (req, res) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/consultas/${req.params.id}/finalizar`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao finalizar consulta:", error.message);
    res.status(error.response?.status || 500).send("Erro ao finalizar consulta.");
  }
});

// GET /consultas/:id : Buscar consulta por ID
router.get('/consultas/:id', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/consultas/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao buscar consulta:", error.message);
    res.status(error.response?.status || 500).send("Erro ao buscar consulta.");
  }
});

// GET /consultas : Listar todas as consultas
router.get('/consultas', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/consultas`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar consultas:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar consultas.");
  }
});

// GET /consultas/proximas48h : Listar consultas que ocorrerão nas próximas 48h
router.get('/consultas/proximas48h', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/consultas/proximas48h`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar consultas próximas 48h:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar consultas próximas 48h.");
  }
});

// --- Especialidade ---
// POST /especialidades : Criar especialidade
router.post('/especialidades', async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/especialidades`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao criar especialidade:", error.message);
    res.status(error.response?.status || 500).send("Erro ao criar especialidade.");
  }
});

// GET /especialidades/:id : Buscar especialidade por ID
router.get('/especialidades/:id', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/especialidades/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao buscar especialidade:", error.message);
    res.status(error.response?.status || 500).send("Erro ao buscar especialidade.");
  }
});

// GET /especialidades : Listar todas especialidades
router.get('/especialidades', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/especialidades`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar especialidades:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar especialidades.");
  }
});

// DELETE /especialidades/:id : Deletar especialidade
router.delete('/especialidades/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${APPOINTMENT_SERVICE_URL}/especialidades/${req.params.id}`);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro ao deletar especialidade:", error.message);
    res.status(error.response?.status || 500).send("Erro ao deletar especialidade.");
  }
});

// --- Profissional ---
// PUT /profissionais/:id/status : Alterar status do profissional
router.put('/profissionais/:id/status', async (req, res) => {
  try {
    const status = req.query.status;
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/profissionais/${req.params.id}/status`, null, {
      params: { status }
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro ao alterar status do profissional:", error.message);
    res.status(error.response?.status || 500).send("Erro ao alterar status do profissional.");
  }
});

// POST /profissionais : Criar profissional
router.post('/profissionais', async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/profissionais`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao criar profissional:", error.message);
    res.status(error.response?.status || 500).send("Erro ao criar profissional.");
  }
});

// GET /profissionais/:id : Buscar profissional por ID
router.get('/profissionais/:id', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/profissionais/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao buscar profissional:", error.message);
    res.status(error.response?.status || 500).send("Erro ao buscar profissional.");
  }
});

// GET /profissionais : Listar todos profissionais
router.get('/profissionais', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/profissionais`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar profissionais:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar profissionais.");
  }
});

// DELETE /profissionais/:id : Deletar profissional
router.delete('/profissionais/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${APPOINTMENT_SERVICE_URL}/profissionais/${req.params.id}`);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro ao deletar profissional:", error.message);
    res.status(error.response?.status || 500).send("Erro ao deletar profissional.");
  }
});

// GET /profissionais/status : Listar todos os status possíveis do enum StatusProfissional
router.get('/profissionais/status', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/profissionais/status`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao listar status profissionais:", error.message);
    res.status(error.response?.status || 500).send("Erro ao listar status profissionais.");
  }
});

// =============================
// === ms-autenticacao endpoints ===
// =============================

// POST /auth/register : Registrar usuário
router.post('/auth/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.message);
    res.status(error.response?.status || 500).send("Erro ao registrar usuário.");
  }
});

// POST /auth/login : Login e geração de token JWT
router.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(error.response?.status || 500).send("Erro no login.");
  }
});

// GET /auth/validate : Validar token JWT
router.get('/auth/validate', async (req, res) => {
  try {
    const { token } = req.query;
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/validate`, {
      params: { token }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao validar token:", error.message);
    res.status(error.response?.status || 500).send("Erro ao validar token.");
  }
});

module.exports = router;