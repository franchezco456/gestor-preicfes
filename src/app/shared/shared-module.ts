import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@NgModule({
  declarations: [CardComponent, InputComponent, ButtonComponent, SelectComponent, CheckboxComponent, SearchbarComponent, SidebarComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  exports: [CardComponent, InputComponent, ButtonComponent, SelectComponent, CheckboxComponent, SearchbarComponent, SidebarComponent],
})
export class SharedModule {}
