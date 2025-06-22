const express = require('express');
const axios = require('axios');
const router = express.Router();

const PATIENT_SERVICE_URL = process.env.USER_SERVICE_URL;

// GET /pacientes
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE_URL}/pacientes`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao listar pacientes' });
  }
});

// GET /pacientes/:id
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE_URL}/pacientes/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao buscar paciente' });
  }
});

// PUT /pacientes/:id
router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${PATIENT_SERVICE_URL}/pacientes/${req.params.id}`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao atualizar paciente' });
  }
});

// DELETE /pacientes/:id
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${PATIENT_SERVICE_URL}/pacientes/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao excluir paciente' });
  }
});

// POST /pacientes/:id/transacoes
router.post('/:id/transacoes', async (req, res) => {
  try {
    const response = await axios.post(`${PATIENT_SERVICE_URL}/pacientes/${req.params.id}/transacoes`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao adicionar transação' });
  }
});

module.exports = router;
