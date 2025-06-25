const express = require('express');
const axios = require('axios');
const router = express.Router();

const { USER_SERVICE_URL, APPOINTMENT_SERVICE_URL, AUTH_SERVICE_URL } = require('../config');

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

module.exports = router;
