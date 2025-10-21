import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormEstudiantesPageRoutingModule } from './form-estudiantes-routing.module';

import { SharedModule } from '../../../shared/shared-module';
import { FormEstudiantesPage } from './form-estudiantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormEstudiantesPageRoutingModule,
    SharedModule,
  ],
  declarations: [FormEstudiantesPage]
})
export class FormEstudiantesPageModule {}
