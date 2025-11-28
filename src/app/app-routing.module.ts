import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth-guard';
import { noAuthGuard } from './core/guards/no-auth/no-auth-guard';

const routes: Routes = [


  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [noAuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'form-estudiantes',
    loadChildren: () => import('./pages/formularios/form-estudiantes/form-estudiantes.module').then( m => m.FormEstudiantesPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'form-coordinadores',
    loadChildren: () => import('./pages/formularios/form-coordinadores/form-coordinadores.module').then( m => m.FormCoordinadoresPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'form-instituciones',
    loadChildren: () => import('./pages/formularios/form-instituciones/form-instituciones.module').then( m => m.FormInstitucionesPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'form-pagos',
    loadChildren: () => import('./pages/formularios/form-pagos/form-pagos.module').then(m => m.FormPagosPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'detalles-estudiante',
    loadChildren: () => import('./pages/detalles/detalles-estudiante/detalles-estudiante.module').then(m => m.DetallesEstudiantePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'actualizar-estudiante',
    loadChildren: () => import('./pages/formularios/actualizar-estudiante/actualizar-estudiante.module').then( m => m.ActualizarEstudiantePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'consultar-payments',
    loadChildren: () => import('./pages/consultar-payments/consultar-payments.module').then(m => m.ConsultarPaymentsPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'detalles-pagos',
    loadChildren: () => import('./pages/detalles/detalles-pagos/detalles-pagos.module').then(m => m.DetallesPagosPageModule),
    canActivate: [authGuard]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
