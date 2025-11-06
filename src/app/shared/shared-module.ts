import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';
import { ChartComponent } from './components/chart/chart.component';

@NgModule({
  declarations: [CardComponent, InputComponent, ButtonComponent, SelectComponent, ChartComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, NgApexchartsModule],
  exports: [CardComponent, InputComponent, ButtonComponent, SelectComponent, ChartComponent],
})
export class SharedModule {}
