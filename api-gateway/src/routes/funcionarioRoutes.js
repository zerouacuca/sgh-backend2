const express = require('express');
const axios = require('axios');
const router = express.Router();

const { USER_SERVICE_URL, APPOINTMENT_SERVICE_URL, AUTH_SERVICE_URL } = require('../config');


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

module.exports = router;
