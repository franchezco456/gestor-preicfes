import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment as env } from 'src/environments/environment';
import { Auth } from './services/auth/auth';
import { Query } from './services/query/query';
import { Cleaner } from './providers/cleaner/cleaner';



@NgModule({
  declarations: [],
  providers: [{
    provide: SupabaseClient,
    useFactory: () => {
      return createClient(env.SUPABASE_APP.URL, env.SUPABASE_APP.API_KEY);
    }
  }, Auth, Query, Cleaner],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
