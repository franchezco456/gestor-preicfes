import { inject } from '@angular/core';
import { CanActivateFn,  Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authSrv = inject(Auth);
  const router = inject(Router);

  try {
    const user = await authSrv.getCurUser();
    if (user) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    console.error('Error en AuthGuard:', error);
    router.navigate(['/login']);
    return false;
  }
};
