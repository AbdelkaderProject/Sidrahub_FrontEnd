import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const token = storageService.getToken();
  const normalizedUrl = req.url.toLowerCase();
  const isSubmissionEndpoint =
    req.url.includes('/FormSubmissions/draft') ||
    req.url.includes('/FormSubmissions/draft-or-create') ||
    req.url.includes('/FormSubmissions/data/save') ||
    req.url.includes('/FormSubmissions/submit');
  const isPublicFormViewRoute = router.url.includes('/forms/view/');
  const forceAnonymousSubmissionEndpoint = isSubmissionEndpoint && isPublicFormViewRoute;
  const isPublicFormEndpoint = req.url.includes('/FormBuilder/code/')
    || req.url.includes('/FormBuilder/by-code/')
    || req.url.includes('/FormBuilder/public/')
    || req.url.includes('/FormRules/form/')
    || req.url.includes('/FormFields/tab/')
    || req.url.includes('/FormGrids/')
    || req.url.includes('/FormTabs/')
    || forceAnonymousSubmissionEndpoint
    || isPublicFormViewRoute;
  const isDebugMode = environment.config?.enableDebug;
  const isAuthRequest = normalizedUrl.includes('/api/auth/login') || normalizedUrl.includes('/api/auth/register');

  if (token && !forceAnonymousSubmissionEndpoint) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned).pipe(
      tap((response) => {
        if (isDebugMode) {
          console.log('[AuthInterceptor] Response received:', {
            url: req.url,
            status: response instanceof HttpErrorResponse ? response.status : 'OK'
          });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (isPublicFormEndpoint || isPublicFormViewRoute) {
            return throwError(() => error);
          }

          const isLoginPage = router.url.includes('/pages/login');
          if (!isAuthRequest && !isLoginPage) {
            storageService.clear();
            router.navigate(['/pages/login']);
          }
        }

        return throwError(() => error);
      })
    );
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (isPublicFormEndpoint || isPublicFormViewRoute || isAuthRequest) {
          return throwError(() => error);
        }

        const isLoginPage = router.url.includes('/pages/login');
        if (!isLoginPage) {
          storageService.clear();
          router.navigate(['/pages/login'], {
            queryParams: { returnUrl: router.url }
          });
        }
      }

      return throwError(() => error);
    })
  );
};
