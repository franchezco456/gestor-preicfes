import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from './components/chart/chart.component';

@NgModule({
  declarations: [ChartComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, NgApexchartsModule],
  exports: [ChartComponent],
})
export class SharedModule {}
