import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coordinator } from 'src/app/shared/services/coordinator/coordinator';
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
  public  institutionsOptions: SelectOption[] = [
    { value: '001', text: 'Institución 1' },
    { value: '002', text: 'Institución 2' },
    { value: '003', text: 'Institución 3' },
  ];

  constructor(private readonly formBuilder: FormBuilder, private readonly coordinatorSrv: Coordinator) {
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

  public async submitCoordinatorForm() {
    if (!this.coordinatorForm.valid) {
      return;
    }
    const Coordinator: Co = {
      CC: this.coordinatorForm.value.CC,
      Name: this.coordinatorForm.value.Name,
      LastName: this.coordinatorForm.value.LastName,
      Address: this.coordinatorForm.value.Address,
      Email: this.coordinatorForm.value.Email,
      Nit_Educational_Institution: this.coordinatorForm.value.Nit_Educational_Institution,
    };
    const result = await this.coordinatorSrv.addCoordinator(Coordinator, this.coordinatorForm.value.Number);
    console.log('Resultado de agregar coordinador:', JSON.stringify(result));
    this.coordinatorForm.reset();
  }
}
