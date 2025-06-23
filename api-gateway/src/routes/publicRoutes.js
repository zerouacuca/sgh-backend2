const express = require('express');
const axios = require('axios');
const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;           // URL do ms-autenticacao

// =============================
// === ms-autenticacao endpoints ===
// =============================

// POST /auth/login : Login e geração de token JWT
router.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(error.response?.status || 500).send("Erro no login.");
  }
});

// GET /auth/validate : Validar token JWT
router.get('/auth/validate', async (req, res) => {
  try {
    const { token } = req.query;
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/validate`, {
      params: { token }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao validar token:", error.message);
    res.status(error.response?.status || 500).send("Erro ao validar token.");
  }
});

// POST /pacientes : Criar paciente
router.post('/pacientes', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/pacientes`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Erro ao criar paciente:", error.message);
    res.status(error.response?.status || 500).send("Erro ao criar paciente.");
  }
});


// =============================
// === ms-consulta endpoints ===
// =============================
