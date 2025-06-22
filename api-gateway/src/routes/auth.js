const express = require('express');
const axios = require('axios');

const router = express.Router();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro no registro' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro no login' });
  }
});

// GET /auth/validate?token=...
router.get('/validate', async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/validate`, { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Erro na validação' });
  }
});

module.exports = router;
