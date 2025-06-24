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


// =============================
// === ms-consulta endpoints ===
// =============================
module.exports = router;
