import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Query } from 'src/app/core/services/query/query';
import { Loading } from 'src/app/core/services/loading/loading';
import { Toast } from 'src/app/core/services/toast/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Data } from 'src/app/core/services/data/data';
import type { Student, Invoices, Payment } from '../../../../domain/models/index';

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
export class FormPagosPage implements OnInit, OnDestroy {
  private allStudents: Student[] = [];
  private allInvoices: Invoices[] = [];
  private allPayments: Payment[] = [];
  private studentsSubscription?: Subscription;
  private invoicesSubscription?: Subscription;
  private paymentsSubscriptions?: Subscription;                                 
  public filteredStudentResults: any[] = [];
  public studentSearchQuery: string = '';
  public student !: Student;
  public invoiceSummary !: Invoices;


  @Input() public value: number | string | undefined;

  public paymentForm!: FormGroup;
  public filteredResults: SearchOptions[] = [];
  public searchQuery: string = '';
  async ionViewWillEnter() {
    await this.loadData();
  }
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast,
    private readonly preferencesSrv: Preferences,
    private readonly route: ActivatedRoute,
    private readonly dataSrv: Data
  ) {
    this.initForm();
  }

  async ngOnInit() {
    this.studentsSubscription = this.dataSrv.students$.subscribe(students => {
      this.allStudents = students;
    });

    this.invoicesSubscription = this.dataSrv.invoices$.subscribe(invoices => {
      this.allInvoices = invoices;
    });

    this.paymentsSubscriptions =  this.dataSrv.payments$.subscribe(payments =>{
      this.allPayments = payments;
    })
    await this.loadData();

    if (this.value !== undefined && this.paymentForm) {
      this.paymentForm.get('amount')?.setValue(this.value);
    }

  }

  ngOnDestroy() {
    this.studentsSubscription?.unsubscribe();
    this.invoicesSubscription?.unsubscribe();
    this.paymentsSubscriptions?.unsubscribe();
  }

  private initForm() {
    this.paymentForm = this.formBuilder.group({
      payerName: [{ value: '', disabled: true }],
      id_Student: [{ value: '', disabled: true }, [Validators.pattern(/^\d{5,20}$/)]],
      amount: [this.value ?? '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
  }

  private async loadData() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('[DetallesEstudiante] Param id =', id);
    const coord = await this.preferencesSrv.getPreferences('coordData');
    const existStudents = this.dataSrv.currentStudents.length > 0;

    if (!existStudents) {
      await this.loadStudents(coord);
      this.findStudent(id || '');
    } else {
      this.findStudent(id || '');
    }
    const existInvoices = this.dataSrv.currentInvoices.length > 0;
    if (!existInvoices) {
      await this.loadInvoices(coord);
      this.findInvoices(id || '');
    } else {
      this.findInvoices(id || '');
    }
    console.log('[Pagos] Suscrito a estudiantes, total =', this.allStudents);
    console.log('[Pagos] Suscrito a facturas, total =', this.allInvoices);
  }

  private async loadStudents(coord: any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      await this.dataSrv.loadStudents({ id_IE: id_IE });
    } else {
      await this.dataSrv.loadStudents({});
    }

  }

  private async loadInvoices(coord: any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      await this.dataSrv.loadInvoices({ id_IE: id_IE });
    } else {
      await this.dataSrv.loadInvoices({});
    }
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
      if (Payment.value > this.invoiceSummary.remaining_debt) {
        this.toastSrv.showWarningToast('El valor del pago no puede ser mayor al saldo pendiente.');
        await this.loadingSrv.dismissLoading();
        return;
      }
      console.log('Pago enviado:', JSON.stringify(Payment));
      const response = await this.querySrv.execute_Function('register_payment', Payment);
      console.log('Pago registrado:', JSON.stringify(this.student));
      this.dataSrv.loadPayments({id_IE: this.student.id_IE});
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
      (s.name || '').toLowerCase().includes(q) ||
      (s.lastname || '').toLowerCase().includes(q) ||
      (s.id_student || '').toLowerCase().includes(q)
    );
    console.log('[Pagos] Filtrados', this.filteredStudentResults.length, 'estudiantes para query =', q);
  }

  public async selectStudentSearchResult(item: Student) {

    this.paymentForm.get('payerName')?.setValue(`${item.name} ${item.lastname}`);
    this.paymentForm.get('id_Student')?.setValue(item.id_student);
    this.findStudent(item.id_student);
    this.findInvoices(item.id_student);
    this.studentSearchQuery = `${item.name} ${item.lastname}`;
    this.filteredStudentResults = [];
    console.log('[Pagos] Selected student:', item);
  }

  private findStudent(id : string ) {
    try {
      const s = this.allStudents.find(st => st.id_student === id);
      if (!s) { return; }
      this.student = {
        id_student: s.id_student ?? '',
        no_document: s.no_document ?? '',
        document_type: s.document_type ?? 'TI',
        name: s.name ?? '',
        lastname: s.lastname ?? '',
        email: s.email ?? '',
        address: s.address ?? '',
        phone: s.phone ?? '',
        id_IE: s.id_IE ?? '',
        discount: s.discount ?? 0,
        installments: s.installments ?? 0,
        grado: s.grado ?? ''
      };
      this.paymentForm.get('payerName')?.setValue(`${this.student.name} ${this.student.lastname}`);
      this.paymentForm.get('id_Student')?.setValue(this.student.id_student);
    } catch (e) {
      console.error('[DetallesEstudiante] Error cargando estudiante', e);
    }
  }

  private findInvoices(studentId: string) {
    try {

      const invoiceData = this.allInvoices.find((inv: any) => inv.invoice_id === studentId);
      if (!invoiceData) {
        return;
      }
      this.invoiceSummary = {
        invoice_id: invoiceData.invoice_id,
        creation_date: invoiceData.creation_date,
        status: invoiceData.status,
        total_value: invoiceData.total_value,
        discount: invoiceData.discount,
        paid_amount: invoiceData.paid_amount,
        installments: invoiceData.installments,
        remaining_debt: invoiceData.remaining_debt,
        student_id: invoiceData.student_id,
        ie_id: invoiceData.ie_id
      };
    } catch (e) {
      console.warn('[DetallesEstudiante] No se pudo cargar pago', e);
    }
  }
}
