import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase } from './providers/supabase/supabase';



@NgModule({
  declarations: [],
  providers: [Supabase],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
