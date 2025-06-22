const express = require('express');
const axios = require('axios');

const router = express.Router();
const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL; // URL do ms-paciente

// POST /agendamentos
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${PATIENT_SERVICE_URL}/agendamentos`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro ao agendar consulta' });
  }
});

module.exports = router;
