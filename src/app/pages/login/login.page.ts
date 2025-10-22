import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  public readonly loginForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public submitLogin(): void {
    if (this.loginForm.invalid) {
      console.error('Error al iniciar sesión: revisa los campos obligatorios.');
      this.loginForm.markAllAsTouched();
      return;
    }

  const email = this.getControl('email')?.value ?? '';
  console.log('Inicio de sesión exitoso.', { email });
    this.loginForm.reset();
  }

  public getControl(controlName: 'email' | 'password'): AbstractControl | null {
    return this.loginForm.get(controlName);
  }

  public getFieldCss(controlName: 'email' | 'password'): string {
    const control = this.getControl(controlName);
    const classes = ['auth-field'];

    if (control && control.invalid && (control.dirty || control.touched)) {
      classes.push('invalid');
    }

    return classes.join(' ');
  }

}
