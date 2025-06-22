const express = require('express');
const axios = require('axios');

const router = express.Router();
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL;

// POST /profissionais
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/profissionais`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao criar profissional' });
  }
});

// GET /profissionais/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/profissionais/${id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Profissional não encontrado' });
  }
});

// GET /profissionais
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/profissionais`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao listar profissionais' });
  }
});

// DELETE /profissionais/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${APPOINTMENT_SERVICE_URL}/profissionais/${id}`);
    res.status(response.status).send();
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao deletar profissional' });
  }
});

module.exports = router;
