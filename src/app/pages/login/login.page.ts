import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { Loading } from 'src/app/core/services/loading/loading';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Query } from 'src/app/core/services/query/query';
import { Toast } from 'src/app/core/services/toast/toast';
import { Coordinator } from 'src/app/shared/services/coordinator/coordinator';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  public loginForm !: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly authSrv: Auth,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast,
    private readonly preferencesSrv: Preferences,
    private readonly coordinatorSrv: Coordinator,
    private readonly router: Router) {
    this.initForm();
    this.skiplogin();
  }

  private initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public async submitLogin() {
    if (this.loginForm.invalid) {
      await this.toastSrv.showWarningToast("Complete todos los campos");
      return;
    }
    try {
      await this.loadingSrv.showLoading();
      const login = await this.authSrv.login(this.loginForm.value.email, this.loginForm.value.password);
      console.log("TAG: LOGIN" + JSON.stringify(login));
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast("Inicio de sesión exitoso");
      await this.saveLogin();
      this.router.navigate(["/home"]);
      this.loginForm.reset();
    } catch (error) {
      await this.toastSrv.showErrorToast("Error al iniciar sesion");
      await this.loadingSrv.dismissLoading();
      this.loginForm.reset();
    }
  }

  public async skiplogin() {
    const credentials = await this.preferencesSrv.getPreferences("login");
    if (credentials) {
      try {
        await this.loadingSrv.showLoading();
        const login = await this.authSrv.login(credentials.email, credentials.password);
        console.log("TAG: LOGIN" + JSON.stringify(login));
        const last_signIn = login.last_sign_in_at;
        await this.loadingSrv.dismissLoading();
        await this.toastSrv.showToast("Ultimo inicio de sesion " + last_signIn);
        console.log("login skipeado " + JSON.stringify(credentials.role));
        this.router.navigate(["/home"]);
        this.loginForm.reset();
      } catch (error) {
        await this.toastSrv.showErrorToast("Error al iniciar sesion");
        await this.loadingSrv.dismissLoading();
        this.loginForm.reset();
      }
    }
  }

  public async saveLogin() {
    const response = await this.querySrv.execute_Function("is_coordinator", { email_param: this.loginForm.value.email });
    let role = "Coordinator";
    if (!response) {
      role = "Administrator"
    }
    const coordData = await this.coordinatorSrv.getCoordinator({ Email: this.loginForm.value.email });
    if (!coordData || coordData.length === 0) {
      await this.preferencesSrv.setPreferences("login", { email: this.loginForm.value.email, password: this.loginForm.value.password, role: role });
      console.log("login guardado")
      return;
    }
    console.log("Datos del coordinador: ", JSON.stringify(coordData));
    await this.preferencesSrv.setPreferences("login", { email: this.loginForm.value.email, password: this.loginForm.value.password, role: role, coordData: coordData[0] });
    console.log("login guardado")
  }
}
