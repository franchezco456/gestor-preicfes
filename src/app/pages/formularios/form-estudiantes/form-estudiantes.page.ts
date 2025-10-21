import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface SelectOption {
  value: string;
  label: string;
}

type StudentFormValues = {
  TI: string;
  Name: string;
  LastName: string;
  Address: string;
  Email: string;
  Number: string;
  Course: string;
  Nit_Educational_Institution: string;
};

@Component({
  selector: 'app-form-estudiantes',
  templateUrl: './form-estudiantes.page.html',
  styleUrls: ['./form-estudiantes.page.scss'],
  standalone: false,
})
export class FormEstudiantesPage implements OnInit {
  public readonly studentForm: FormGroup;
  public readonly institutionsOptions: SelectOption[] = [
    { value: '0001', label: 'Institución 1' },
    { value: '0002', label: 'Institución 2' },
    { value: '0003', label: 'Institución 3' },
  ];

  public readonly studentSummaryFields: Array<{ label: string; key: keyof StudentFormValues }> = [
    { label: 'TI', key: 'TI' },
    { label: 'Nombre', key: 'Name' },
    { label: 'Apellido', key: 'LastName' },
    { label: 'Dirección', key: 'Address' },
    { label: 'Correo', key: 'Email' },
    { label: 'Número', key: 'Number' },
    { label: 'Curso', key: 'Course' },
    { label: 'NIT institución', key: 'Nit_Educational_Institution' },
  ];

  public studentResult: StudentFormValues | null = null;
  private hasTriedSubmit = false;

  constructor(private readonly formBuilder: FormBuilder) {
    this.studentForm = this.formBuilder.group({
      TI: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', [Validators.required, Validators.email]],
      Number: ['', [Validators.required, Validators.pattern(/^\d{7,12}$/)]],
      Course: ['', [Validators.required, Validators.minLength(1)]],
      Nit_Educational_Institution: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  public submitStudentForm(): void {
    this.hasTriedSubmit = true;

    if (this.studentForm.invalid) {
      this.markAllControlsAsTouched();
      this.studentResult = null;
      return;
    }

  this.studentResult = { ...(this.studentForm.value as StudentFormValues) };
    console.log('Registro de estudiante recibido:', this.studentResult);
    this.studentForm.reset();
    this.hasTriedSubmit = false;
  }

  public shouldShowError(controlName: keyof StudentFormValues): boolean {
    const control = this.studentForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty || this.hasTriedSubmit);
  }

  public getErrorMessage(controlName: keyof StudentFormValues): string {
    const control = this.studentForm.get(controlName);
    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio.';
    }

    if (control.errors['email']) {
      return 'Ingresa un correo electrónico válido.';
    }

    if (control.errors['pattern']) {
      return 'El formato ingresado no es válido.';
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Debe tener al menos ${requiredLength} caracteres.`;
    }

    return 'El valor ingresado no es válido.';
  }

  private markAllControlsAsTouched(): void {
    Object.values(this.studentForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }
}
