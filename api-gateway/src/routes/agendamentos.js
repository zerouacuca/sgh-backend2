const express = require('express');
const axios = require('axios');

const router = express.Router();
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL;

// GET /agendamentos
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/agendamentos`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao listar agendamentos' });
  }
});

// GET /agendamentos/consulta/:consultaId
router.get('/consulta/:consultaId', async (req, res) => {
  try {
    const { consultaId } = req.params;
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/agendamentos/consulta/${consultaId}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao buscar agendamentos por consulta' });
  }
});

// GET /agendamentos/paciente/:pacienteId
router.get('/paciente/:pacienteId', async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/agendamentos/paciente/${pacienteId}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao buscar agendamentos por paciente' });
  }
});

// PUT /agendamentos/:id/cancelar
router.put('/:id/cancelar', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`${APPOINTMENT_SERVICE_URL}/agendamentos/${id}/cancelar`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao cancelar agendamento' });
  }
});

module.exports = router;
