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
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { FabbutomComponent } from './components/fabbutom/fabbutom.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [CardComponent, ListComponent,InputComponent, ButtonComponent, SelectComponent, ChartComponent,SearchbarComponent, FabbutomComponent, CheckboxComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, NgApexchartsModule],
  exports: [CardComponent,ListComponent, InputComponent, ButtonComponent, SelectComponent, ChartComponent,SearchbarComponent, FabbutomComponent, CheckboxComponent],
})
export class SharedModule {}
