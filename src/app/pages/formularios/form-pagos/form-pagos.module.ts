import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPagosPageRoutingModule } from './form-pagos-routing.module';

import { FormPagosPage } from './form-pagos.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    FormPagosPageRoutingModule
  ],
  declarations: [FormPagosPage]
})
export class FormPagosPageModule {}
