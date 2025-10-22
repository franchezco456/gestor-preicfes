import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type SelectOption = {
  value: string;
  text: string;
};

@Component({
  selector: 'app-form-estudiantes',
  templateUrl: './form-estudiantes.page.html',
  styleUrls: ['./form-estudiantes.page.scss'],
  standalone: false,
})
export class FormEstudiantesPage {
  public studentForm !: FormGroup;
  public institutionsOptions: SelectOption[] = [
    { value: '0001', text: 'Institución 1' },
    { value: '0002', text: 'Institución 2' },
    { value: '0003', text: 'Institución 3' },
  ];

  constructor(private readonly formBuilder: FormBuilder) {
    this.initForm();
  }

  private initForm() {
    this.studentForm = this.formBuilder.group({
      TI: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', [Validators.required, Validators.email]],
      Number: ['', [Validators.required, Validators.pattern(/^\d{7,12}$/)]],
      Grade: ['', [Validators.required, Validators.minLength(1)]],
      Nit_Educational_Institution: ['', [Validators.required]],
    });
  }
  
  public submitStudentForm(): void {
    if (!this.studentForm.valid) {
      console.error('El formulario no es válido');
      return;
    }

    console.log('Datos del formulario de estudiantes:', this.studentForm.value);
    this.studentForm.reset();
  }
}
