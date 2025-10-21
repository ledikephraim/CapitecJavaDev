import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const isTransactionService = req.url.includes(environment.transactionsAPIBaseUrl);

  // Safely get token from localStorage
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;

  if (isTransactionService && token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
