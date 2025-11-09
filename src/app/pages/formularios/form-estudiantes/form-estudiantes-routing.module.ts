import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormEstudiantesPage } from './form-estudiantes.page';

const routes: Routes = [
  {
    path: '',
    component: FormEstudiantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormEstudiantesPageRoutingModule {}
