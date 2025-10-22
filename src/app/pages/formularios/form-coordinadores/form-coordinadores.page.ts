import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public  institutionsOptions: SelectOption[] = [
    { value: '0001', text: 'Institución 1' },
    { value: '0002', text: 'Institución 2' },
    { value: '0003', text: 'Institución 3' },
  ];

  constructor(private readonly formBuilder: FormBuilder) {
    this.initForm();
  }

  private initForm() {
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

  public submitCoordinatorForm(): void {
    if (!this.coordinatorForm.valid) {
      return;
    }

    console.log(
      'Datos del formulario de coordinadores:',
      this.coordinatorForm.value
    );
    this.coordinatorForm.reset();
  }
}
