import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loading } from 'src/app/core/services/loading/loading';
import { Query } from 'src/app/core/services/query/query';
import { Toast } from 'src/app/core/services/toast/toast';
import { Institution as In } from 'src/domain/models/Institution';

@Component({
  selector: 'app-form-instituciones',
  templateUrl: './form-instituciones.page.html',
  styleUrls: ['./form-instituciones.page.scss'],
  standalone: false,
})
export class FormInstitucionesPage {
  public institutionForm !: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast) {
    this.initForm();
  }

  private initForm() {
    this.institutionForm = this.formBuilder.group({
      Nit: ['', [Validators.required, Validators.pattern(/^\d{3,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Course_Value: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
  }

  public async submitInstitutionForm() {
    if (!this.institutionForm.valid) {
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }
    try {
      await this.loadingSrv.showLoading("Registrando institución...");
      const Institution= {
        NIT: this.institutionForm.value.Nit,
        Name: this.institutionForm.value.Name,
        Address: this.institutionForm.value.Address,
        Course_Value: parseFloat(this.institutionForm.value.Course_Value)
      }
      const result = await this.querySrv.create("Educational_Institution",Institution);
      this.institutionForm.reset();
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Institución agregada exitosamente.');
    } catch (error) {
      this.toastSrv.showErrorToast("Error al agregar la institución educativa.");
      await this.loadingSrv.dismissLoading();
    }

  }
}
