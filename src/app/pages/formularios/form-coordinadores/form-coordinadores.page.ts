import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/core/services/auth/auth';
import { Loading } from 'src/app/core/services/loading/loading';
import { Toast } from 'src/app/core/services/toast/toast';
import { Query } from '../../../core/services/query/query';

type SelectOption = {
  value: string;
  text: string;
};

@Component({
  selector: 'app-form-coordinadores',
  templateUrl: './form-coordinadores.page.html',
  styleUrls: ['./form-coordinadores.page.scss'],
  standalone: false,
})
export class FormCoordinadoresPage {
  public coordinatorForm !: FormGroup;
  public institutionsOptions: SelectOption[] = [];

  constructor(private readonly formBuilder: FormBuilder,
    private readonly authSrv: Auth,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast) {
    this.initForm();
    this.getEducationalInstitutions();
  }

  private initForm() {
    this.coordinatorForm = this.formBuilder.group({
      CC: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^\d{7,12}$/)]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      id_IE: ['', [Validators.required]],
    });
  }

  public async submitCoordinatorForm() {
    if (!this.coordinatorForm.valid) {
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }
    try {
      await this.loadingSrv.showLoading("Registrando coordinador...");
      const Coordinator = {
        id_coordinator: this.coordinatorForm.value.CC,
        name: this.coordinatorForm.value.Name,
        lastname: this.coordinatorForm.value.LastName,
        email: this.coordinatorForm.value.Email,
        address: this.coordinatorForm.value.Address,
        phone: this.coordinatorForm.value.Phone,
        id_ie_cicle: this.coordinatorForm.value.id_IE
      };
      const register = await this.authSrv.register(this.coordinatorForm.value.Email, this.coordinatorForm.value.Password);
      const result = await this.querySrv.execute_Function('register_coordinator', Coordinator);
      this.coordinatorForm.reset();
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Coordinador registrado exitosamente.');
    } catch (error) {
      this.toastSrv.showErrorToast("Error al registrar el coordinador.");
      await this.loadingSrv.dismissLoading();
    }
  }

  public async getEducationalInstitutions() {
    try {
      await this.loadingSrv.showLoading("Cargando instituciones educativas...");
      const institutions = await this.querySrv.execute_Function('get_ie');
      console.log("Instituciones educativas: " + JSON.stringify(institutions));
      this.institutionsOptions = institutions.map((inst: any): SelectOption => ({
        value: inst.id_ie_cicle_out,
        text: inst.name_out
      }));
      await this.loadingSrv.dismissLoading();
    } catch (error) {
      this.toastSrv.showErrorToast("Error al cargar las instituciones educativas.");
      await this.loadingSrv.dismissLoading();
    }
  }
}
