import { Component, Input, OnInit } from '@angular/core';
import { Query } from 'src/app/core/services/query/query';
import { Loading } from 'src/app/core/services/loading/loading';
import { Toast } from 'src/app/core/services/toast/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  public async onStudentSearchInput(value: string) {
    this.studentSearchQuery = value ?? '';
    const q = (this.studentSearchQuery || '').trim().toLowerCase();
    console.log('[Pagos] onStudentSearchInput query =', q);
    if (!q) {
      this.filteredStudentResults = [];
      return;
    }
    if (this.allStudents.length === 0) {
      try {
        const list: any[] = await this.querySrv.getAll('Student');
        this.allStudents = Array.isArray(list) ? list.map(r => ({
          TI: r.id ?? '',
          DocumentType: r.Document_Type ?? 'TI',
          Name: r.Name ?? '',
          LastName: r.LastName ?? '',
          Email: r.Email ?? '',
          Address: r.Address ?? '',
          Grade: '',
        })) : [];
        console.log('[Pagos] Cargados desde BD', this.allStudents.length, 'estudiantes');
      } catch (e) {
        console.error('[ERROR] Fallo carga de estudiantes', e);
        this.allStudents = [];
      }
    }
    this.filteredStudentResults = this.allStudents.filter((s) =>
      (s.Name || '').toLowerCase().includes(q) ||
      (s.LastName || '').toLowerCase().includes(q) ||
      (s.TI || '').toLowerCase().includes(q)
    );
    console.log('[Pagos] Filtrados', this.filteredStudentResults.length, 'estudiantes para query =', q);
  }

  public selectStudentSearchResult(item: any) {

    this.paymentForm.get('payerName')?.setValue(`${item.Name} ${item.LastName}`);
    this.paymentForm.get('documentNumber')?.setValue(item.TI);
    this.studentSearchQuery = `${item.Name} ${item.LastName}`;
    this.filteredStudentResults = [];
    console.log('[Pagos] Selected student:', item);
  }
  @Input() public value: number | string | undefined;

  public paymentForm!: FormGroup;
  public submittedResult: any = null;
  public filteredResults: SearchOptions[] = [];
  public searchQuery: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast
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
      documentNumber: [{ value: '', disabled: true }, [Validators.pattern(/^\d{5,20}$/)]],
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
      const Payment = {
        payerName: this.paymentForm.value.payerName,
        documentNumber: this.paymentForm.value.documentNumber,
        value: this.paymentForm.value.amount
      };
      console.log('Pago enviado:', JSON.stringify(Payment));
      const response = await this.querySrv.execute_Function('register_payment', Payment);
      console.log('Respuesta registro pago:', JSON.stringify(response));
      this.paymentForm.reset();
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Pago registrado exitosamente.');
      this.submittedResult = { ok: true };
    } catch (error) {
      this.toastSrv.showErrorToast("Error al registrar el pago.");
      await this.loadingSrv.dismissLoading();
    }
  }


  public selectSearchResult(item: SearchOptions) {

    this.paymentForm
      .get('payerName')
      ?.setValue(`${item.Name} ${item.LastName}`);
    this.paymentForm.get('documentNumber')?.setValue(item.ID);
    this.searchQuery = `${item.Name} ${item.LastName}`;
    this.filteredResults = [];
  }
}
