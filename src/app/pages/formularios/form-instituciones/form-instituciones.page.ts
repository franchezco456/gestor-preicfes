import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type InstitutionFormValues = {
  Nit: string;
  Name: string;
  Address: string;
  Course_Value: string;
};

@Component({
  selector: 'app-form-instituciones',
  templateUrl: './form-instituciones.page.html',
  styleUrls: ['./form-instituciones.page.scss'],
  standalone: false,
})
export class FormInstitucionesPage implements OnInit {
  public readonly institutionForm: FormGroup;
  public institutionResult: InstitutionFormValues | null = null;
  private hasTriedSubmit = false;

  public readonly institutionSummaryFields: Array<{ label: string; key: keyof InstitutionFormValues }> = [
    { label: 'NIT', key: 'Nit' },
    { label: 'Nombre', key: 'Name' },
    { label: 'Dirección', key: 'Address' },
    { label: 'Valor del curso', key: 'Course_Value' },
  ];

  constructor(private readonly formBuilder: FormBuilder) {
    this.institutionForm = this.formBuilder.group({
      Nit: ['', [Validators.required, Validators.pattern(/^\d{4,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Course_Value: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
  }

  ngOnInit(): void {}

  public submitInstitutionForm(): void {
    this.hasTriedSubmit = true;

    if (this.institutionForm.invalid) {
      this.markAllControlsAsTouched();
      this.institutionResult = null;
      return;
    }

    this.institutionResult = {
      ...(this.institutionForm.value as InstitutionFormValues),
    };
    console.log('Registro de institución recibido:', this.institutionResult);
    this.institutionForm.reset();
    this.hasTriedSubmit = false;
  }

  public shouldShowError(controlName: keyof InstitutionFormValues): boolean {
    const control = this.institutionForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty || this.hasTriedSubmit);
  }

  public getErrorMessage(controlName: keyof InstitutionFormValues): string {
    const control = this.institutionForm.get(controlName);
    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio.';
    }

    if (control.errors['pattern']) {
      if (controlName === 'Course_Value') {
        return 'Ingresa un valor numérico con hasta dos decimales.';
      }
      return 'El formato ingresado no es válido.';
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Debe tener al menos ${requiredLength} caracteres.`;
    }

    return 'El valor ingresado no es válido.';
  }

  private markAllControlsAsTouched(): void {
    Object.values(this.institutionForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }
}
