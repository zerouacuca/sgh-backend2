const express = require('express');
const axios = require('axios');

const router = express.Router();
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL;

// POST /especialidades
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/especialidades`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao criar especialidade' });
  }
});

// GET /especialidades/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/especialidades/${id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Especialidade não encontrada' });
  }
});

// GET /especialidades
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/especialidades`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao listar especialidades' });
  }
});

// DELETE /especialidades/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${APPOINTMENT_SERVICE_URL}/especialidades/${id}`);
    res.status(response.status).send();
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao deletar especialidade' });
  }
});

module.exports = router;
