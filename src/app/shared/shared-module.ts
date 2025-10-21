import { input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent} from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [CardComponent, InputComponent, ButtonComponent, SelectComponent],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [CardComponent, InputComponent, ButtonComponent, SelectComponent]
})
export class SharedModule { }
