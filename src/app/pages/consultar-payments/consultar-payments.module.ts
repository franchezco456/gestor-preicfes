import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultarPaymentsPageRoutingModule } from './consultar-payments-routing.module';

import { ConsultarPaymentsPage } from './consultar-payments.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultarPaymentsPageRoutingModule,
    SharedModule
  ],
  declarations: [ConsultarPaymentsPage]
})
export class ConsultarPaymentsPageModule {}
