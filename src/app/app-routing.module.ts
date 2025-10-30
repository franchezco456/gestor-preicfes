import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'form-estudiantes',
    loadChildren: () => import('./pages/formularios/form-estudiantes/form-estudiantes.module').then( m => m.FormEstudiantesPageModule)
  },
  {
    path: 'form-coordinadores',
    loadChildren: () => import('./pages/formularios/form-coordinadores/form-coordinadores.module').then( m => m.FormCoordinadoresPageModule)
  },
  {
    path: 'form-instituciones',
    loadChildren: () => import('./pages/formularios/form-instituciones/form-instituciones.module').then( m => m.FormInstitucionesPageModule)
  },  {
    path: 'form-pagos',
    loadChildren: () => import('./pages/formularios/form-pagos/form-pagos.module').then( m => m.FormPagosPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
