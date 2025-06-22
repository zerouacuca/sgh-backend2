const express = require('express');
const axios = require('axios');
const router = express.Router();

const PATIENT_SERVICE_URL = process.env.USER_SERVICE_URL;

// GET /pacientes/cpf/:cpf
router.get('/cpf/:cpf', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE_URL}/pacientes/cpf/${req.params.cpf}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao buscar CPF' });
  }
});

// GET /pacientes/email/:email
router.get('/email/:email', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE_URL}/pacientes/email/${req.params.email}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao buscar email' });
  }
});

// POST /pacientes (cadastro público)
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${PATIENT_SERVICE_URL}/pacientes`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao cadastrar paciente' });
  }
});

module.exports = router;
