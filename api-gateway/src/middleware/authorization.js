const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

/**
 * Middleware que recebe um array de perfis permitidos,
 * verifica o token e se o perfil do usuário está entre eles.
 */
function authorize(perfisPermitidos = []) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Token mal formatado' });

      // Validar token e pegar perfil do usuário
      // Assumindo endpoint /auth/userinfo que retorna { email, perfil }
      const response = await axios.get(`${AUTH_SERVICE_URL}/auth/userinfo`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = response.data;
      if (!user || !user.perfil) {
        return res.status(401).json({ error: 'Perfil não encontrado' });
      }

      if (!perfisPermitidos.includes(user.perfil)) {
        return res.status(403).json({ error: 'Acesso negado para seu perfil' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Erro na autorização:', error.message);
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  };
}

module.exports = authorize;
