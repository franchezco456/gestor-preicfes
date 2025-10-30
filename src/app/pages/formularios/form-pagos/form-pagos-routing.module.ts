import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormPagosPage } from './form-pagos.page';

const routes: Routes = [
  {
    path: '',
    component: FormPagosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormPagosPageRoutingModule {}
