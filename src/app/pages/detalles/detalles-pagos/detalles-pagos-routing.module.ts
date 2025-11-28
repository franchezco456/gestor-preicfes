import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesPagosPage } from './detalles-pagos.page';

const routes: Routes = [
  {
    path: ':id',
    component: DetallesPagosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesPagosPageRoutingModule {}
