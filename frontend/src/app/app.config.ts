import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { authInterceptor } from './Services/auth-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(NgbModule),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideNgxMask(),
  ],
};
