import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const authSrv = inject(Auth);
  const router = inject(Router);

  try {
    const user = await authSrv.getCurUser();
    if (user) {
      router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error en AuthGuard:', error);
    router.navigate(['/login']);
    return true;
  }
};
