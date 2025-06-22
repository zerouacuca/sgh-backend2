const express = require('express');
const axios = require('axios');

const router = express.Router();
const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL;

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
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Paciente não encontrado' });
  }
});

// GET /pacientes/cpf/:cpf
router.get('/cpf/:cpf', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE_URL}/pacientes/cpf/${req.params.cpf}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Paciente não encontrado' });
  }
});

// GET /pacientes/email/:email
router.get('/email/:email', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE_URL}/pacientes/email/${req.params.email}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Paciente não encontrado' });
  }
});

// POST /pacientes
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${PATIENT_SERVICE_URL}/pacientes`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao cadastrar paciente' });
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
    res.status(response.status).send();
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao deletar paciente' });
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
