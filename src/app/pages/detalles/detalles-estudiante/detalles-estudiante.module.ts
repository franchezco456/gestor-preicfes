import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesEstudiantePageRoutingModule } from './detalles-estudiante-routing.module';

import { DetallesEstudiantePage } from './detalles-estudiante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesEstudiantePageRoutingModule
  ],
  declarations: [DetallesEstudiantePage]
})
export class DetallesEstudiantePageModule {}
