import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from 'src/app/shared/services/student/student';
import { Student as St } from 'src/domain/models/Student';

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
    { value: '001', text: 'Institución 1' },
    { value: '002', text: 'Institución 2' },
    { value: '003', text: 'Institución 3' },
  ];

  constructor(private readonly formBuilder: FormBuilder, private readonly studentSrv: Student) {
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
  
  public async  submitStudentForm(){
    if (!this.studentForm.valid) {
      console.error('El formulario no es válido');
      return;
    }

    const Student :  St = {
      TI: this.studentForm.value.TI,
      Name: this.studentForm.value.Name,
      LastName: this.studentForm.value.LastName,
      Address: this.studentForm.value.Address,
      Email: this.studentForm.value.Email,
      Grade: this.studentForm.value.Grade,
      Nit_Educational_Institution: this.studentForm.value.Nit_Educational_Institution
    }
    const result = await this.studentSrv.addStudent(Student, this.studentForm.value.Number);
    console.log('Resultado de agregar estudiante:', result);
    this.studentForm.reset();
  }
}
