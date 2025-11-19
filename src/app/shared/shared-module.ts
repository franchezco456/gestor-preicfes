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
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { FabbutomComponent } from './components/fabbutom/fabbutom.component';

@NgModule({
  declarations: [CardComponent, InputComponent, ButtonComponent, SelectComponent, ChartComponent, SidebarComponent, SearchbarComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, NgApexchartsModule, FabbutomComponent],
  exports: [CardComponent, InputComponent, ButtonComponent, SelectComponent, ChartComponent, SidebarComponent, SearchbarComponent, FabbutomComponent],
})
export class SharedModule {}
