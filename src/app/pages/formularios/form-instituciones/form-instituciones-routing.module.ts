import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormInstitucionesPage } from './form-instituciones.page';

const routes: Routes = [
  {
    path: '',
    component: FormInstitucionesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormInstitucionesPageRoutingModule {}
