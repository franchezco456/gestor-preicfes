import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Loading } from 'src/app/core/services/loading/loading';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Toast } from 'src/app/core/services/toast/toast';
import { Query } from 'src/app/core/services/query/query';
import { Subscription } from 'rxjs';
import { Data } from 'src/app/core/services/data/data';
import { Student, Institution } from 'src/domain/models/index';
@Component({
  selector: 'app-actualizar-estudiante',
  templateUrl: './actualizar-estudiante.page.html',
  styleUrls: ['./actualizar-estudiante.page.scss'],
  standalone: false
})
export class ActualizarEstudiantePage implements OnInit {
  public studentForm !: FormGroup;
  public institutionsOptions: { value: string; text: string }[] = [];
  public isCoordinator: boolean = true;
  public searchTI: string = '';
  private institutionSubscription !: Subscription;
  private studentsSubscription?: Subscription;
  public allInstitutions: Institution[] = [];
  private allStudents: any[] = [];
  public filteredResults: any[] = [];
  public searchQuery: string = '';
  public updatingStudentId: string | null = null;


  async ionViewWillEnter() {
    await this.loadData();
  }


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast,
    private readonly preferencesSrv: Preferences,
    private readonly dataSrv: Data
  ) {
    this.initForm();
  }


  ngOnInit() {
    this.institutionSubscription = this.dataSrv.institutions$.subscribe(institutions => {
      this.allInstitutions = institutions;
    });

    this.studentsSubscription = this.dataSrv.students$.subscribe(students => {
      this.allStudents = students;
    });

  }

  ngOnDestroy() {
      this.institutionSubscription.unsubscribe();
      this.studentsSubscription?.unsubscribe();
  }

  private initForm() {
    this.studentForm = this.formBuilder.group({
      DocumentType: ['TI', []],
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
  }

  public async submitStudentForm() {
    if (!this.studentForm.valid) {
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }

    try {
      await this.loadingSrv.showLoading(this.updatingStudentId ? 'Actualizando estudiante...' : 'Procesando...');


      const raw = this.studentForm.getRawValue ? this.studentForm.getRawValue() : this.studentForm.value;
      const idStudentValue = this.updatingStudentId ?? raw.TI;

      const Student: any = {
        id_student: idStudentValue,
        document_type: raw.DocumentType,
        name: raw.Name,
        lastname: raw.LastName,
        email: raw.Email,
        address: raw.Address,
        phone: raw.Phone,
        grade: raw.Grade,
        discount: raw.Discount ? parseFloat(raw.Discount) : 0,
        installments: raw.Installments ? parseInt(raw.Installments, 10) : 3,
        id_ie_cicle: raw.id_IE,
      };


      try {
        const response = await this.querySrv.execute_Function('register_student', Student);
        console.log('Respuesta update_student:', response);
      } catch (rpcErr) {
        console.warn('update_student RPC falló o no existe, intentando fallback con Query.update()', rpcErr);
      }
      this.studentForm.reset();
      const coord = await this.preferencesSrv.getPreferences('coordData');
      await this.loadStudents(coord);
      await this.autoSetEducationalInstitution(coord);
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Estudiante actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando estudiante', error);
      this.toastSrv.showErrorToast('Error al actualizar el estudiante.');
      await this.loadingSrv.dismissLoading();
    }
  }

  public async loadData() {
    const id = this.route.snapshot.paramMap.get('id');
    const coord = await this.preferencesSrv.getPreferences('coordData');
    const existIEs = this.dataSrv.currentInstitutions.length > 0;
    if (!existIEs) {
      await this.loadIEs();
      this.mapInstitutionsOptions();
      await this.autoSetEducationalInstitution(coord);
    }else{
      this.mapInstitutionsOptions();
      await this.autoSetEducationalInstitution(coord);
    }

    const existStudents = this.dataSrv.currentStudents.length > 0;
    if (!existStudents) {
      await this.loadStudents(id!);
      await this.setCurStudent(id!);
    }else{
      await this.setCurStudent(id!);
    }
  }

  private async loadIEs() {
    await this.dataSrv.loadInstitutions({});
    if (!this.allInstitutions || this.allInstitutions.length === 0) {
      await this.loadingSrv.dismissLoading();
      this.toastSrv.showErrorToast('No hay instituciones educativas disponibles.');
      return;
    }
  }

  private async loadStudents(coord : any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      await this.dataSrv.loadStudents({ id_IE: id_IE });
    } else {
      await this.dataSrv.loadStudents({});
    }
  }

  private async setCurStudent(id : string){
       if (!this.allStudents || this.allStudents.length === 0) {
      this.toastSrv.showErrorToast('No se encontraron estudiantes para cargar los datos.');
      await this.loadingSrv.dismissLoading();
      return;
    }
    let student = this.allStudents.find(s => s.id_student === id)!;
    if (!student) {
      this.toastSrv.showErrorToast('Estudiante no encontrado.');
      await this.loadingSrv.dismissLoading();
      return;
    }
    this.patchStudentRow(student);
    console.log('[Pagos] Suscrito a estudiantes, total =', this.allStudents);
    await this.loadingSrv.dismissLoading();
  }

  public async autoSetEducationalInstitution(coordData : any) {
    if (!coordData) {
      this.isCoordinator = false;
      return;
    }
    const id_ie_cicle = coordData.coordData.id_IE_Cicle;
    this.studentForm.get('id_IE')?.setValue(id_ie_cicle);

  }

  private mapInstitutionsOptions() {
    this.allInstitutions = this.dataSrv.currentInstitutions;
    this.institutionsOptions = this.allInstitutions.map((inst: Institution) => ({
      value: inst.id_ie_cicle,
      text: inst.name
    }));
}

  private patchStudentRow(s: Student) {
    if (!s) return;
    const tiValue = s.no_document ?? '';
    this.updatingStudentId = tiValue;
    this.studentForm.patchValue({
      DocumentType: s.document_type ?? 'TI',
      TI: tiValue,
      Name: s.name ?? '',
      LastName: s.lastname ?? '',
      Email: s.email ?? '',
      Address: s.address ?? '',
      Phone: s.phone ?? '',
      Grade: s.grado ?? '',
      Discount: s.discount ?? '',
      Installments: s.installments ?? ''
    });

    try {
      this.studentForm.get('TI')?.disable();
    } catch (e) {
      console.warn('[ActualizarEstudiante] Could not disable TI control', e);
    }
  }




  public onSearchInput(ev: any) {

    const v = (typeof ev === 'string') ? ev : (ev?.detail?.value ?? ev?.target?.value ?? '');
    this.searchTI = v;
    this.searchQuery = v;
    console.log('[ActualizarEstudiante] onSearchInput value=', this.searchQuery);

    const q = (this.searchQuery || '').trim().toLowerCase();
    if (!q) {
      this.filteredResults = [];
      return;
    }

    this.filteredResults = this.allStudents.filter((s: Student) =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.lastname || '').toLowerCase().includes(q) ||
      (s.no_document || '').toLowerCase().includes(q)
    );
    console.log('[ActualizarEstudiante] Filtrados', this.filteredResults.length, 'estudiantes para query =', q);
  }

  public selectSearchResult(item: any) {
    console.log('[ActualizarEstudiante] Selected search item:', item);
    this.searchQuery = '';
    this.filteredResults = [];

    if (item) {
      this.patchStudentRow(item);
      this.toastSrv.showSuccessToast('Estudiante cargado');
    }
  }
}
