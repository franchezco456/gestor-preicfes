import { Injectable } from '@angular/core';
import { Supabase } from '../../providers/supabase/supabase';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private supabasePrv: Supabase) { }

  async register(email: string, password: string) {
    const { data, error } = await this.supabasePrv.client.auth.signUp({
      email: email,
      password: password
    });
    if (error) { throw error }
    return data.user;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabasePrv.client.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (error) { throw error }
    return data.user;
  }

  async logout() {
    const { error } = await this.supabasePrv.client.auth.signOut();
    if (!error) { 
      return "200";
    }else{
      throw error ;
    }
  }

  
}
