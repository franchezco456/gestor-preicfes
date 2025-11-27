import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loading } from 'src/app/core/services/loading/loading';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Toast } from 'src/app/core/services/toast/toast';
import { Query } from 'src/app/core/services/query/query';
import { Data } from 'src/app/core/services/data/data';
import { Subscription } from 'rxjs';
import { Institution } from 'src/domain/models/index';

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
export class FormEstudiantesPage implements OnInit, OnDestroy{
  private institutionSubscription !: Subscription;
  public allInstitutions: Institution[] = [];
  public studentForm !: FormGroup;
  public institutionsOptions: SelectOption[] = [];
  public isCoordinator: boolean = true;

  async ionViewWillEnter() {
    await this.loadData();
  }
  constructor(private readonly formBuilder: FormBuilder,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast,
    private readonly dataSrv : Data,
    private readonly preferencesSrv: Preferences) {
      this.initForm();
  }

  ngOnInit(): void {
     this.institutionSubscription = this.dataSrv.institutions$.subscribe(institutions => {
      this.allInstitutions = institutions;
    });
  }

  ngOnDestroy(): void {
    this.institutionSubscription.unsubscribe();
  }
  private async loadData() {
        await this.loadingSrv.showLoading("Cargando datos...");
        await this.dataSrv.loadInstitutions({});
        this.institutionsOptions = this.allInstitutions.map((inst: Institution): SelectOption => ({
        value: inst.id_ie_cicle,
        text: inst.name
        }));
        await this.autoSetEducationalInstitution();
        await this.loadingSrv.dismissLoading();
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
      Phone: ['', [Validators.required, Validators.pattern(/^\d{7,12}$/)]],
      Grade: ['', [Validators.required, Validators.minLength(1)]],
      Discount: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Installments: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      id_IE: ['', [Validators.required]],
    });

    // No extra input required when selecting 'OT' (otros)
  }

  public async submitStudentForm() {
    if (!this.studentForm.valid) {
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }
    try {
      await this.loadingSrv.showLoading("Registrando estudiante...");
      const Student = {
        id_student: this.studentForm.value.TI,
        document_type: this.studentForm.value.DocumentType,
        name: this.studentForm.value.Name,
        lastname: this.studentForm.value.LastName,
        email: this.studentForm.value.Email,
        address: this.studentForm.value.Address,
        phone: this.studentForm.value.Phone,
        grade: this.studentForm.value.Grade,
        discount: this.studentForm.value.Discount ? parseFloat(this.studentForm.value.Discount) : undefined,
        installments: this.studentForm.value.Installments ? parseInt(this.studentForm.value.Installments, 10) : undefined,
        id_ie_cicle: this.studentForm.value.id_IE
      }
      console.log("Estudiante a registrar: " + JSON.stringify(Student));
      const response = await this.querySrv.execute_Function('register_student', Student);
      console.log(JSON.stringify(response));
      this.studentForm.reset();
      this.autoSetEducationalInstitution();
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Estudiante registrado exitosamente.');
    } catch (error) {
      this.toastSrv.showErrorToast("Error al registrar el estudiante.");
      await this.loadingSrv.dismissLoading();
    }
  }



  public async autoSetEducationalInstitution() {
    const coordData = await this.preferencesSrv.getPreferences("coordData");
    if (!coordData) {
      this.isCoordinator = false;
      return;
    }
    const id_ie_cicle = coordData.coordData.id_IE_Cicle;
    this.studentForm.get('id_IE')?.setValue(id_ie_cicle);

  }
}
