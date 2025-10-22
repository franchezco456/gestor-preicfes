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
      Nit: ['', [Validators.required, Validators.pattern(/^\d{3,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Course_Value: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
    }

  public submitInstitutionForm(): void {
    if (!this.institutionForm.valid) {
      return;
    }

    console.log('Datos del formulario de instituciones:', this.institutionForm.value);
    this.institutionForm.reset();
  }
}
