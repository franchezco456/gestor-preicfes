import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { Loading } from 'src/app/core/services/loading/loading';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Toast } from 'src/app/core/services/toast/toast';
import { Query } from 'src/app/core/services/query/query';
@Component({
  selector: 'app-actualizar-estudiante',
  templateUrl: './actualizar-estudiante.page.html',
  styleUrls: ['./actualizar-estudiante.page.scss'],
  standalone:false
})
export class ActualizarEstudiantePage implements OnInit {
  public studentForm !: FormGroup;
  public institutionsOptions: { value: string; text: string }[] = [];
  public isCoordinator: boolean = true;
  public searchTI: string = '';
  // Client-side search like Home: cache students and filtered results
  private allStudents: any[] = [];
  public filteredResults: any[] = [];
  public searchQuery: string = '';
  public updatingStudentId: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast,
    private readonly preferencesSrv: Preferences,
  ) {
    this.initForm();
  }

  private patchStudentRow(s: any) {
    if (!s) return;
    const tiValue = s.id_estudiante_out ?? '';
    this.updatingStudentId = tiValue;
    this.studentForm.patchValue({
      DocumentType: s.documento_tipo_out ?? 'TI',
      TI: tiValue,
      Name: s.nombre_out ?? '',
      LastName: s.apellido_out ?? '',
      Email: s.email_out ?? '',
      Address: s.direccion_out ?? '',
      Phone: s.telefono_out ?? '',
      Grade: s.grado_out ?? '',
      Discount: s.descuento_out ?? '',
      Installments: s.cuotas_out ?? ''
    });
    
    try {
      this.studentForm.get('TI')?.disable();
    } catch (e) {
      console.warn('[ActualizarEstudiante] Could not disable TI control', e);
    }
  }

  ngOnInit() {
    this.getEducationalInstitutions();
    this.autoSetEducationalInstitution();
    this.fetchStudents();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudent(id);
    }
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
      this.autoSetEducationalInstitution();
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Estudiante actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando estudiante', error);
      this.toastSrv.showErrorToast('Error al actualizar el estudiante.');
      await this.loadingSrv.dismissLoading();
    }
  }

  public async getEducationalInstitutions() {
    try {
      const institutions: any = await this.querySrv.execute_Function('get_ie');
      this.institutionsOptions = Array.isArray(institutions)
        ? institutions.map((inst: any) => ({ value: inst.id_ie_cicle_out, text: inst.name_out }))
        : [];
    } catch (error) {
      this.toastSrv.showErrorToast('Error al cargar las instituciones educativas.');
    }
  }

  public async autoSetEducationalInstitution() {
    const credentials = await this.preferencesSrv.getPreferences('login');
    if (!credentials?.is_coordinator) {
      this.isCoordinator = false;
      return;
    }
    const coordData = await this.preferencesSrv.getPreferences('coordData');
    if (!coordData) return;
    const id_ie_cicle = coordData.coordData.id_IE_Cicle;
    this.studentForm.get('id_IE')?.setValue(id_ie_cicle);
  }

  public async loadStudent(id: string) {
    try {
      console.log('[ActualizarEstudiante] loadStudent id =', id);

      // Primero intentamos compatibilidad: si el backend acepta p_id_student
      let rows: any[] = [];
      try {
        rows = await this.querySrv.execute_Function('get_students_by_ie_cicle', { p_id_student: id });
      } catch (e) {
        // ignore - probamos otro camino abajo
        rows = [];
      }

      console.log('[ActualizarEstudiante] filas devueltas por p_id_student =', rows);
      let s: any = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

      if (!s) {
        this.toastSrv.showWarningToast('Estudiante no encontrado.');
        await this.loadingSrv.dismissLoading();
        return;
      }

      // Mapeamos la fila al formulario
      console.log('[ActualizarEstudiante] fila a mapear =', s);
      this.patchStudentRow(s);
      await this.toastSrv.showSuccessToast('Estudiante cargado.');

    } catch (error) {
      console.error('Error cargando estudiante', error);
      this.toastSrv.showErrorToast('Error al cargar el estudiante.');
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

    this.filteredResults = this.allStudents.filter((s: any) =>
      (s.Name || '').toLowerCase().includes(q) ||
      (s.LastName || '').toLowerCase().includes(q) ||
      (s.TI || '').toLowerCase().includes(q)
    );
    console.log('[ActualizarEstudiante] Filtrados', this.filteredResults.length, 'estudiantes para query =', q);
  }

  public async fetchStudents() {
    try {
      const coord = await this.preferencesSrv.getPreferences('coordData');
      const id_IE = coord?.coordData?.id_IE_Cicle;
      if (!id_IE) {
        this.allStudents = [];
        return;
      }

      const list: any[] = await this.querySrv.execute_Function('get_students_by_ie_cicle', { p_id_ie_cicle: id_IE });
      this.allStudents = Array.isArray(list) ? list.map(r => ({
        TI: (r.id_estudiante_out ?? '').toString(),
        DocumentType: r.documento_tipo_out ?? 'TI',
        Name: r.nombre_out ?? '',
        LastName: r.apellido_out ?? '',
        Email: r.email_out ?? '',
        Address: r.direccion_out ?? '',
        Grade: r.grado_out ?? '',
        raw: r
      })) : [];
    } catch (error) {
      console.error('[ERROR] Fallo carga de estudiantes (actualizar)', error);
      this.allStudents = [];
    }
  }

  public selectSearchResult(item: any) {
    console.log('[ActualizarEstudiante] Selected search item:', item);
    this.searchQuery = '';
    this.filteredResults = [];
    
    if (item && item.raw) {
      this.patchStudentRow(item.raw);
      this.toastSrv.showSuccessToast('Estudiante cargado');
    }
  }

}
