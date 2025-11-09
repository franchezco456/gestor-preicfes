import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private supabasePrv: SupabaseClient) { }

  async register(email: string, password: string) {
    const { data, error } = await this.supabasePrv.auth.signUp({
      email: email,
      password: password
    });
    if (error) { throw error }
    return data.user;
  }

  async getCurUser(){
    const {data, error} = await this.supabasePrv.auth.getSession();
    if (error) { throw error }
    return data.session?.user;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabasePrv.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (error) { throw error }
    return data.user;
  }

  async logout() {
    const { error } = await this.supabasePrv.auth.signOut();
    if (!error) { 
      return "200";
    }else{
      throw error ;
    }
  }

  
}
