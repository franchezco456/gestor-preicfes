import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultarPaymentsPage } from './consultar-payments.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultarPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultarPaymentsPageRoutingModule {}
