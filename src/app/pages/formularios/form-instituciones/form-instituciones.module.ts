import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FormInstitucionesPageRoutingModule } from './form-instituciones-routing.module';
import { FormInstitucionesPage } from './form-instituciones.page';
import { SharedModule } from '../../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormInstitucionesPageRoutingModule,
    SharedModule,
  ],
  declarations: [FormInstitucionesPage],
})
export class FormInstitucionesPageModule {}
