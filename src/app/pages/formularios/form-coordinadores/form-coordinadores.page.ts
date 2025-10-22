import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/core/services/auth/auth';
import { Loading } from 'src/app/core/services/loading/loading';
import { Toast } from 'src/app/core/services/toast/toast';
import { Coordinator } from 'src/app/shared/services/coordinator/coordinator';
import { Institution } from 'src/app/shared/services/institution/institution';
import { Coordinator as Co } from 'src/domain/models/Coordinator';

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
    private readonly coordinatorSrv: Coordinator,
    private readonly authSrv : Auth,
    private readonly institutionSrv : Institution,
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
      Number: ['', [Validators.required, Validators.pattern(/^\d{7,12}$/)]],
      Password : ['' , [Validators.required, Validators.minLength(6)]],
      Nit_Educational_Institution: ['', [Validators.required]],
    });
  }

  public async submitCoordinatorForm() {
    if (!this.coordinatorForm.valid) {
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }
    try {
      await this.loadingSrv.showLoading("Registrando coordinador...");
      const Coordinator: Co = {
        CC: this.coordinatorForm.value.CC,
        Name: this.coordinatorForm.value.Name,
        LastName: this.coordinatorForm.value.LastName,
        Address: this.coordinatorForm.value.Address,
        Email: this.coordinatorForm.value.Email,
        Nit_Educational_Institution: this.coordinatorForm.value.Nit_Educational_Institution,
      };
      const register = await this.authSrv.register(this.coordinatorForm.value.Email, this.coordinatorForm.value.Password);
      const result = await this.coordinatorSrv.addCoordinator(Coordinator, this.coordinatorForm.value.Number);
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
      const institutions = await this.institutionSrv.getAllInstitutions();
      this.institutionsOptions = institutions.map((inst) : SelectOption => ({
        value: inst.NIT,
        text: inst.Name
      }));
      await this.loadingSrv.dismissLoading();
    } catch (error) {
      this.toastSrv.showErrorToast("Error al cargar las instituciones educativas.");
      await this.loadingSrv.dismissLoading();
    }
  }
}
