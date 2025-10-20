import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCoordinadoresPage } from './form-coordinadores.page';

const routes: Routes = [
  {
    path: '',
    component: FormCoordinadoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCoordinadoresPageRoutingModule {}
