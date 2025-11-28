import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesPagosPageRoutingModule } from './detalles-pagos-routing.module';

import { DetallesPagosPage } from './detalles-pagos.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesPagosPageRoutingModule,
    SharedModule
  ],
  declarations: [DetallesPagosPage]
})
export class DetallesPagosPageModule {}
