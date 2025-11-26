import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared-module';

import { IonicModule } from '@ionic/angular';

import { ActualizarEstudiantePageRoutingModule } from './actualizar-estudiante-routing.module';

import { ActualizarEstudiantePage } from './actualizar-estudiante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ActualizarEstudiantePageRoutingModule,
    SharedModule
  ],
  declarations: [ActualizarEstudiantePage]
})
export class ActualizarEstudiantePageModule {}
