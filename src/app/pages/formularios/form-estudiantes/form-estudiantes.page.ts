import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coordinator as Co } from 'src/domain/models/Coordinator';
import { Loading } from 'src/app/core/services/loading/loading';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Toast } from 'src/app/core/services/toast/toast';
import { Coordinator } from 'src/app/shared/services/coordinator/coordinator';
import { Institution } from 'src/app/shared/services/institution/institution';
import { Student as St } from 'src/domain/models/Student';
import { Query } from 'src/app/core/services/query/query';

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
    private readonly institutionSrv: Institution,
    private readonly coordAuthSrv: Coordinator,
    private readonly querySrv: Query,
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

    // No extra input required when selecting 'OT' (otros)
  }

  public async submitStudentForm() {
    //if (!this.studentForm.valid) {
  //      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
    //  return;
  //  }
    try {
    await this.loadingSrv.showLoading("Registrando estudiante...");
    let phone = '9089786756';
    let id_ie =  '001-123456';
    let cicle = '001';
    const Student = {
      id_student: this.studentForm.value.TI,
      document_type: this.studentForm.value.DocumentType,
      name: this.studentForm.value.Name,
      lastname: this.studentForm.value.LastName,
      email: this.studentForm.value.Email,
      address: this.studentForm.value.Address,
      phone : phone,
      grade: this.studentForm.value.Grade,
      discount: this.studentForm.value.Discount ? parseFloat(this.studentForm.value.Discount) : undefined,
      installments: this.studentForm.value.Installments ? parseInt(this.studentForm.value.Installments, 10) : undefined,
      id_ie_cicle : id_ie,
      id_cicle : cicle
    }
    const response = await this.querySrv.execute_Function('register_student', Student);
    console.log(JSON.stringify(response));
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
