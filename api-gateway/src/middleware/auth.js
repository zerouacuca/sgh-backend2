const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ error: 'Token mal formatado' });

    // Valida o token chamando o microsserviço ms-autenticacao
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/validate`, {
      params: { token },
    });

    if (!response.data) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Token válido, você pode opcionalmente buscar os dados do usuário aqui (se houver endpoint)
    // ou incluir o token para ser usado depois
    req.user = { token };

    next();
  } catch (error) {
    console.error('Erro na validação do token:', error.message);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
