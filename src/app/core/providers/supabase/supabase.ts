import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  private supabase : SupabaseClient;

  constructor(){
    this.supabase = createClient(environment.SUPABASE_APP.URL,environment.SUPABASE_APP.API_KEY);
  }

  get client(){return this.supabase;}
}
