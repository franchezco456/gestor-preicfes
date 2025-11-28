import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();
  constructor(private supabasePrv: SupabaseClient, private injector: Injector) {
    this.loadSession();

    this.supabasePrv.auth.onAuthStateChange((event, session) => {
      console.log('Evento Auth:', event);
      if (session?.user) {
        this._currentUser.next(session.user);
      } else {
        this._currentUser.next(null);
      }
    });
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabasePrv.auth.signUp({
      email: email,
      password: password
    });
    if (error) { throw error }
    return data.user;
  }

  async loadSession() {
    const { data } = await this.supabasePrv.auth.getSession();
    if (data.session?.user) {
      this._currentUser.next(data.session.user);
    }
  }

  async getCurUser() {
    try {
      const { data, error } = await this.supabasePrv.auth.getSession();
      if (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
      }
      return data.session?.user ?? null;
    } catch (error) {
      console.error('Excepción en getCurUser:', error);
      return null;
    }
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
      const router = this.injector.get(Router);
      router.navigate(['/login'], { replaceUrl: true });
      return "200";
    }else{
      throw error ;
    }
  }

  
}
