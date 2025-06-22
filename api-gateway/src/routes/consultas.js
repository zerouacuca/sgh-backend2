const express = require('express');
const axios = require('axios');

const router = express.Router();
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL;

// POST /consultas/agendar
router.post('/agendar', async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/consultas/agendar`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao agendar consulta' });
  }
});

// PUT /consultas/:id/cancelar
router.put('/:id/cancelar', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/consultas/${id}/cancelar`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao cancelar consulta' });
  }
});

// PUT /consultas/:id/check-in
router.put('/:id/check-in', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/consultas/${id}/check-in`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro no check-in' });
  }
});

// PUT /consultas/:id/realizar
router.put('/:id/realizar', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/consultas/${id}/realizar`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao realizar consulta' });
  }
});

// GET /consultas/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/consultas/${id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Consulta não encontrada' });
  }
});

// GET /consultas
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/consultas`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao listar consultas' });
  }
});

module.exports = router;
