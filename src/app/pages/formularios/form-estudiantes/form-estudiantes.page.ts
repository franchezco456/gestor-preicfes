import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coordinator as Co } from 'src/domain/models/Coordinator';
import { Loading } from 'src/app/core/services/loading/loading';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Toast } from 'src/app/core/services/toast/toast';
import { Coordinator } from 'src/app/shared/services/coordinator/coordinator';
import { Institution } from 'src/app/shared/services/institution/institution';
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
  public institutionsOptions: SelectOption[] = [];
  public isCoordinator: boolean = true;

  constructor(private readonly formBuilder: FormBuilder, 
    private readonly studentSrv: Student, 
    private readonly institutionSrv: Institution,
    private readonly coordAuthSrv: Coordinator,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast,
    private readonly preferencesSrv : Preferences) {
    this.initForm();
    this.getEducationalInstitutions();
    this.autoSetEducationalInstitution();
  }

  private initForm() {
    this.studentForm = this.formBuilder.group({
      // Document type (CC, TI, PP) and number
      DocumentType: ['TI', [Validators.required]],
      OtherDocumentType: [''],
      TI: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', [Validators.required, Validators.email]],
      Number: ['', [Validators.required, Validators.pattern(/^\d{7,12}$/)]],
      // Grade may contain alphanumeric characters (e.g. "11A")
      Grade: ['', [Validators.required, Validators.minLength(5)]],
      // Financial fields
      Discount: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Installments: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      Nit_Educational_Institution: ['', [Validators.required]],
    });

    // When the user selects "OTRO" for DocumentType, make OtherDocumentType required
    this.studentForm.get('DocumentType')?.valueChanges.subscribe((val) => {
      const otherCtrl = this.studentForm.get('OtherDocumentType');
      if (!otherCtrl) return;
      if (val === 'OTRO') {
        otherCtrl.setValidators([Validators.required, Validators.minLength(2)]);
      } else {
        otherCtrl.clearValidators();
        otherCtrl.setValue('');
      }
      otherCtrl.updateValueAndValidity({ onlySelf: true });
    });
  }

  public async submitStudentForm() {
    if (!this.studentForm.valid) {
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }
    try {
    await this.loadingSrv.showLoading("Registrando estudiante...");
    const Student: St = {
      TI: this.studentForm.value.TI,
      DocumentType: this.studentForm.value.DocumentType === 'OT' ? this.studentForm.value.OtherDocumentType : this.studentForm.value.DocumentType,
      Name: this.studentForm.value.Name,
      LastName: this.studentForm.value.LastName,
      Address: this.studentForm.value.Address,
      Email: this.studentForm.value.Email,
      Grade: this.studentForm.value.Grade,
      Discount: this.studentForm.value.Discount ? parseFloat(this.studentForm.value.Discount) : undefined,
      Installments: this.studentForm.value.Installments ? parseInt(this.studentForm.value.Installments, 10) : undefined,
      Nit_Educational_Institution: this.studentForm.value.Nit_Educational_Institution
    }
    const result = await this.studentSrv.addStudent(Student, this.studentForm.value.Number);
    this.studentForm.reset();
    await this.loadingSrv.dismissLoading();
    await this.toastSrv.showSuccessToast('Estudiante registrado exitosamente.');
    } catch (error) {
      this.toastSrv.showErrorToast("Error al registrar el estudiante.");
      await this.loadingSrv.dismissLoading();
    }
  }

  public async getEducationalInstitutions() {
    try {
      await this.loadingSrv.showLoading("Cargando instituciones educativas...");
      const institutions = await this.institutionSrv.getAllInstitutions();
      this.institutionsOptions = institutions.map((inst) : SelectOption => ({
        value: inst.NIT,
        text: inst.Name
      }));
      await this.loadingSrv.dismissLoading();
    } catch (error) {
      this.toastSrv.showErrorToast("Error al cargar las instituciones educativas.");
      await this.loadingSrv.dismissLoading();
    }
  }

  public async autoSetEducationalInstitution() {
      const credentials = await this.preferencesSrv.getPreferences("login");
      if(credentials.role !== 'Coordinator'){
        this.isCoordinator = false;
        return;
      }
      const nit = credentials.coordData.Nit_Educational_Institution;
      this.studentForm.get('Nit_Educational_Institution')?.setValue(nit);
    
  }
}
