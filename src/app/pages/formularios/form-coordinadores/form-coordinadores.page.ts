import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface SelectOption {
  value: string;
  label: string;
}

type CoordinatorFormValues = {
  CC: string;
  Name: string;
  LastName: string;
  Address: string;
  Email: string;
  Number: string;
  Nit_Educational_Institution: string;
};

@Component({
  selector: 'app-form-coordinadores',
  templateUrl: './form-coordinadores.page.html',
  styleUrls: ['./form-coordinadores.page.scss'],
  standalone: false,
})
export class FormCoordinadoresPage implements OnInit {
  public readonly coordinatorForm: FormGroup;
  public readonly institutionsOptions: SelectOption[] = [
    { value: '0001', label: 'Institución 1' },
    { value: '0002', label: 'Institución 2' },
    { value: '0003', label: 'Institución 3' },
  ];

  public readonly coordinatorSummaryFields: Array<{ label: string; key: keyof CoordinatorFormValues }> = [
    { label: 'CC', key: 'CC' },
    { label: 'Nombre', key: 'Name' },
    { label: 'Apellido', key: 'LastName' },
    { label: 'Dirección', key: 'Address' },
    { label: 'Correo', key: 'Email' },
    { label: 'Número', key: 'Number' },
    { label: 'NIT institución', key: 'Nit_Educational_Institution' },
  ];

  public coordinatorResult: CoordinatorFormValues | null = null;
  private hasTriedSubmit = false;

  constructor(private readonly formBuilder: FormBuilder) {
    this.coordinatorForm = this.formBuilder.group({
      CC: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', [Validators.required, Validators.email]],
      Number: ['', [Validators.required, Validators.pattern(/^\d{7,12}$/)]],
      Nit_Educational_Institution: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  public submitCoordinatorForm(): void {
    this.hasTriedSubmit = true;

    if (this.coordinatorForm.invalid) {
      this.markAllControlsAsTouched();
      this.coordinatorResult = null;
      return;
    }

    this.coordinatorResult = { ...(this.coordinatorForm.value as CoordinatorFormValues) };
    console.log('Registro de coordinador recibido:', this.coordinatorResult);
    this.coordinatorForm.reset();
    this.hasTriedSubmit = false;
  }

  public shouldShowError(controlName: keyof CoordinatorFormValues): boolean {
    const control = this.coordinatorForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty || this.hasTriedSubmit);
  }

  public getErrorMessage(controlName: keyof CoordinatorFormValues): string {
    const control = this.coordinatorForm.get(controlName);
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
    Object.values(this.coordinatorForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }
}
