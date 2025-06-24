import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor executado para:', req.url);
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Lista de endpoints que não requerem autenticação
  const publicUrls = [
    '/auth/login',
    '/auth/cadastrar',
    '/auth/refresh-token'
  ];

  // Verifica se a URL atual está na lista de públicas
  if (publicUrls.some(url => req.url.includes(url))) {
    return next(req); // Não adiciona o token
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
