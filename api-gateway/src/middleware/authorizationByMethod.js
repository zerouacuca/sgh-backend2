const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

/**
 * Middleware que verifica o token JWT e autoriza o usuário
 * com base no perfil permitido para o método HTTP da requisição.
 *
 * @param {Object} rolesByMethod - objeto com arrays de perfis permitidos por método HTTP.
 * Exemplo:
 * {
 *   GET: ['ADMIN', 'RECEPCAO', 'MEDICO', 'PACIENTE'],
 *   POST: ['ADMIN'],
 *   DELETE: ['ADMIN'],
 *   PUT: ['ADMIN', 'MEDICO']
 * }
 */
function authorizeByMethod(rolesByMethod) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Token mal formatado' });

      // Busca dados do usuário (incluindo perfil) no microsserviço de autenticação
      const response = await axios.get(`${AUTH_SERVICE_URL}/auth/userinfo`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = response.data;
      if (!user || !user.perfil) {
        return res.status(401).json({ error: 'Perfil não encontrado' });
      }

      const method = req.method.toUpperCase();
      const perfisPermitidos = rolesByMethod[method] || [];

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

module.exports = authorizeByMethod;
