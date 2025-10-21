import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCoordinadoresPageRoutingModule } from './form-coordinadores-routing.module';

import { SharedModule } from '../../../shared/shared-module';
import { FormCoordinadoresPage } from './form-coordinadores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormCoordinadoresPageRoutingModule,
    SharedModule,
  ],
  declarations: [FormCoordinadoresPage]
})
export class FormCoordinadoresPageModule {}
