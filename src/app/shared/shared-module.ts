import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';

@NgModule({
  declarations: [CardComponent, InputComponent, ButtonComponent, SelectComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  exports: [CardComponent, InputComponent, ButtonComponent, SelectComponent],
})
export class SharedModule {}
