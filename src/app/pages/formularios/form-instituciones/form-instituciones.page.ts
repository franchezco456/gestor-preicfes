import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-instituciones',
  templateUrl: './form-instituciones.page.html',
  styleUrls: ['./form-instituciones.page.scss'],
  standalone: false,
})
export class FormInstitucionesPage {
   public institutionForm !: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.initForm();
  }

    private initForm() {
    this.institutionForm = this.formBuilder.group({
      Dane: ['', [Validators.required, Validators.pattern(/^\d{3,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
      // Course_Value is provided by the backend; remove input from the form and set a static value on submit
      Discount: ['', [Validators.pattern(/^\d+(\.\d{1,12})?$/)]],
    });
    }

  public submitInstitutionForm(): void {
    if (!this.institutionForm.valid) {
      return;
    }
<<<<<<< Updated upstream
=======
    try {
      await this.loadingSrv.showLoading();
      const Institution: In = {
       Dane: this.institutionForm.value.Dane,
        Name: this.institutionForm.value.Name,
        Address: this.institutionForm.value.Address,
        // Course_Value will be assigned by the backend; use a static placeholder for now
        Course_Value: 250000,
        Discount: this.institutionForm.value.Discount ? parseFloat(this.institutionForm.value.Discount) : undefined,
        Email: this.institutionForm.value.Email,
        Phone: this.institutionForm.value.Phone
      }
      const result = await this.institutionSrv.addInstitution(Institution);
      this.institutionForm.reset();
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Institución agregada exitosamente.');
    } catch (error) {
      this.toastSrv.showErrorToast("Error al agregar la institución educativa.");
      await this.loadingSrv.dismissLoading();
    }
>>>>>>> Stashed changes

    console.log('Datos del formulario de instituciones:', this.institutionForm.value);
    this.institutionForm.reset();
  }

  public test(_: any) {
    const checked = !!_;
    const respuesta = checked ? 'SI' : 'no';
    console.log(`Institución financia el preicfes: ${respuesta}`);
  }

}