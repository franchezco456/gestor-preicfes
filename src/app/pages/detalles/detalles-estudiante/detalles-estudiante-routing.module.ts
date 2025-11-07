import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesEstudiantePage } from './detalles-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesEstudiantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesEstudiantePageRoutingModule {}
