import { Component, Input, OnInit } from '@angular/core';
import { Query } from 'src/app/core/services/query/query';
import { Loading } from 'src/app/core/services/loading/loading';
import { Toast } from 'src/app/core/services/toast/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { ActivatedRoute } from '@angular/router';

interface SearchOptions {
  Name: string;
  LastName: string;
  ID: string;
}

@Component({
  selector: 'app-form-pagos',
  templateUrl: './form-pagos.page.html',
  styleUrls: ['./form-pagos.page.scss'],
  standalone: false,
})
export class FormPagosPage implements OnInit {
  private allStudents: any[] = [];
  public filteredStudentResults: any[] = [];
  public studentSearchQuery: string = '';
  public student: any;
  public paymentSummary: any;

  async ionViewWillEnter() {
    await this.loadingSrv.showLoading('Cargando estudiante...');
    await this.loadStudent();
    await this.loadingSrv.dismissLoading();
  }


  @Input() public value: number | string | undefined;

  public paymentForm!: FormGroup;
  public filteredResults: SearchOptions[] = [];
  public searchQuery: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast,
    private readonly preferencesSrv: Preferences,
    private readonly route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit() {

    if (this.value !== undefined && this.paymentForm) {
      this.paymentForm.get('amount')?.setValue(this.value);
    }
  }

  private initForm() {
    this.paymentForm = this.formBuilder.group({
      payerName: [{ value: '', disabled: true }],
      id_Student: [{ value: '', disabled: true }, [Validators.pattern(/^\d{5,20}$/)]],
      amount: [this.value ?? '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
  }

  public async submitPaymentForm() {
    if (!this.paymentForm.valid) {
      Object.values(this.paymentForm.controls).forEach((c) => c.markAsTouched());
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }
    try {
      await this.loadingSrv.showLoading("Registrando pago...");
      const formValues = this.paymentForm.getRawValue();
      const Payment = {
        id_student: formValues.id_Student,
        value: formValues.amount
      };
      if (Payment.value > this.paymentSummary.pending) {
        this.toastSrv.showWarningToast('El valor del pago no puede ser mayor al saldo pendiente.');
        await this.loadingSrv.dismissLoading();
        return;
      }
      console.log('Pago enviado:', JSON.stringify(Payment));
      const response = await this.querySrv.execute_Function('register_payment', Payment);
      console.log('Respuesta registro pago:', JSON.stringify(response));
      this.studentSearchQuery = '';
      this.paymentForm.reset();
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Pago registrado exitosamente.');
    } catch (error) {
      this.toastSrv.showErrorToast("Error al registrar el pago.");
      console.error('Error registrando pago:', error);
      await this.loadingSrv.dismissLoading();
    }
  }

  public async onStudentSearchInput(value: string) {
    this.studentSearchQuery = value ?? '';
    const q = (this.studentSearchQuery || '').trim().toLowerCase();
    console.log('[Pagos] onStudentSearchInput query =', q);
    if (!q) {
      this.filteredStudentResults = [];
      return;
    }

    this.filteredStudentResults = this.allStudents.filter((s) =>
      (s.Name || '').toLowerCase().includes(q) ||
      (s.LastName || '').toLowerCase().includes(q) ||
      (s.TI || '').toLowerCase().includes(q)
    );
    console.log('[Pagos] Filtrados', this.filteredStudentResults.length, 'estudiantes para query =', q);
  }

  public async selectStudentSearchResult(item: any) {

    this.paymentForm.get('payerName')?.setValue(`${item.Name} ${item.LastName}`);
    this.paymentForm.get('id_Student')?.setValue(item.Id_Student_Cicle);
    await this.loadPayments(item.Id_Student_Cicle);
    this.studentSearchQuery = `${item.Name} ${item.LastName}`;
    this.filteredStudentResults = [];
    console.log('[Pagos] Selected student:', item);
  }

  private async loadStudent() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('[DetallesEstudiante] Param id =', id);
    if (!id) {
      this.fetchStudents();
      return;
    }
    try {
      const rows: any[] = await this.querySrv.execute_Function('get_students_by_ie_cicle', { p_id_student: id });
      const s = Array.isArray(rows) ? rows[0] : null;
      if (!s) { return; }
      this.student = {
        nombre: s.nombre_out ?? '',
        apellido: s.apellido_out ?? '',
        correo: s.email_out ?? '',
        identificacion: s.invoice_id_out ?? id,
        direccion: s.direccion_out ?? '',
        institucion: '',
        estado: '',
        grado: s.grado_out ?? ''
      };
      await this.loadPayments(this.student.identificacion);
      this.paymentForm.get('payerName')?.setValue(`${this.student.nombre} ${this.student.apellido}`);
      this.paymentForm.get('id_Student')?.setValue(this.student.identificacion);
      console.log('[DetallesEstudiante] Estudiante cargado:', this.student);
    } catch (e) {
      console.error('[DetallesEstudiante] Error cargando estudiante', e);
    } finally {
      await this.loadingSrv.dismissLoading();
    }
  }
  private async fetchStudents() {
    try {
      const coord = await this.preferencesSrv.getPreferences('coordData');
      console.log(coord);
      const id_IE = coord.coordData.id_IE_Cicle;

      console.log('[Home] id_IE_Cicle =', id_IE);
      const list: any[] = await this.querySrv.execute_Function('get_students_by_ie_cicle', { p_id_ie_cicle: id_IE })
      this.allStudents = Array.isArray(list) ? list.map(r => ({

          TI: r.id_estudiante_out ?? '',
          DocumentType: r.documento_tipo_out ?? 'TI',
          Name: r.nombre_out ?? '',
          LastName: r.apellido_out ?? '',
          Email: r.email_out ?? '',
          Address: r.direccion_out ?? '',
          Grade: r.grado_out ??'',
          Id_Student_Cicle: r.invoice_id_out ?? '',

      })) : [];
    } catch (error) {
      console.error('[ERROR] Fallo carga de estudiantes', error);
      this.allStudents = [];
    }
  }

  private async loadPayments(studentId: string) {
    try {

      const invoiceData = await this.querySrv.execute_Function('get_invoices', { id_student: studentId });
      if (!invoiceData || invoiceData.length === 0) {
        return;
      }
      const invoice = invoiceData[0];
      this.paymentSummary = {
        courseValue: invoice.total_value,
        totalPaid: invoice.paid_amount,
        pending: invoice.remaining_debt,
        discount: invoice.discount
      };
      console.log('[DetallesEstudiante] Payment summary:', this.paymentSummary);
    } catch (e) {
      console.warn('[DetallesEstudiante] No se pudo cargar pago', e);
    }
  }
}
