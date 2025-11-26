import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarEstudiantePage } from './actualizar-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarEstudiantePage
  }
  ,
  {
    path: ':id',
    component: ActualizarEstudiantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarEstudiantePageRoutingModule {}
