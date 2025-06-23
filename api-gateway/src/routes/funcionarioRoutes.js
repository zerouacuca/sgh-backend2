const express = require('express');
const axios = require('axios');
const router = express.Router();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;           // URL do ms-paciente
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL; // URL do ms-consulta


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


// =============================
// === ms-consulta endpoints ===
// =============================
