import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Data } from 'src/app/core/services/data/data';
import { Loading } from 'src/app/core/services/loading/loading';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Invoices } from 'src/domain/models';
import { Payment } from 'src/domain/models/Payment';
import { Student } from 'src/domain/models/Student';

@Component({
  selector: 'app-detalles-pagos',
  templateUrl: './detalles-pagos.page.html',
  styleUrls: ['./detalles-pagos.page.scss'],
  standalone: false,
})
export class DetallesPagosPage implements OnInit, OnDestroy {
  private allStudents: Student[] = [];
  private allPayments: Payment[] = [];
  private allInvoices: any[] = [];
  private studentsSubscription?: Subscription;
  private paymentsSubscriptions?: Subscription;
  private invoicesSubscription?: Subscription;
  public student !: Student;
  public loading = true;
  public notFound = false;
  public payment !: Payment;
  public invoice !: Invoices;

  async ionViewWillEnter() {
    await this.loadData();
  }
  constructor(
    private readonly preferencesSrv: Preferences,
    private readonly dataSrv: Data,
    private readonly route: ActivatedRoute,
    private readonly loadingSrv: Loading
  ) { }

  ngOnInit() {
    this.studentsSubscription = this.dataSrv.students$.subscribe(students => {
      this.allStudents = students;
    });

    this.invoicesSubscription = this.dataSrv.invoices$.subscribe(invoices => {
      this.allInvoices = invoices;
    });

    this.paymentsSubscriptions = this.dataSrv.payments$.subscribe(payments => {
      this.allPayments = payments;
    });
  }

  ngOnDestroy() {
    this.studentsSubscription?.unsubscribe();
    this.paymentsSubscriptions?.unsubscribe();
    this.invoicesSubscription?.unsubscribe();
  }

  public async loadData() {
    await this.loadingSrv.showLoading();
    const id = this.route.snapshot.paramMap.get('id');
    const coord = await this.preferencesSrv.getPreferences('coordData');
    const existStudents = this.dataSrv.currentStudents.length > 0;
    const existPayments = this.dataSrv.currentPayments.length > 0;
    const existInvoices = this.dataSrv.currentInvoices.length > 0;
    if (!id) {
      this.notFound = true;
      this.loading = false;
      await this.loadingSrv.dismissLoading();
      return;
    }
    try {
      this.loading = true;
      if (!existPayments) {
        await this.loadPayments(coord);
      }

      this.findPaymentByPaymentId(id);
      console.log('[DetallesPago] Pago encontrado:', this.payment);

      if (!existStudents) {
        await this.loadStudents(coord);
      }
      if (this.payment) {
          this.findStudent(this.payment.invoice_id);
        console.log('[DetallesPago] Estudiante encontrado:', this.student);
      } else {
        this.notFound = true;
        return;
      }

      await this.loadInvoices(coord);
      this.invoice = this.findInvoices(this.student.id_student);
      console.log('[DetallesPago] Factura encontrada:', this.invoice);

      if (!this.allStudents || this.allStudents.length === 0) {
        this.notFound = true;
        return;
      }

      console.log('[Pagos] Suscrito a estudiantes, total =', this.allStudents);
      console.log('[Pagos] Suscrito a pagos, total =', this.allPayments);
      this.notFound = false;
      await this.loadingSrv.dismissLoading();
    } catch (error) {
      this.notFound = true;
      console.error('[ERROR] Fallo al cargar datos', error);
    } finally {
      this.loading = false;
      await this.loadingSrv.dismissLoading();
    }
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

  private findStudent(id: string) {
    this.student = this.allStudents.find(s => s.id_student === id)!;
  }

  private async loadPayments(coord: any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      await this.dataSrv.loadPayments({ id_IE: id_IE });
    } else {
      await this.dataSrv.loadPayments({});
    }
  }

  private async loadInvoices(coord: any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      await this.dataSrv.loadInvoices({ id_IE: id_IE });
    }
    else {
      await this.dataSrv.loadInvoices({});
    }
  }

  private findPaymentByPaymentId(id: string) {
    this.payment = this.allPayments.find(p => p.payment_id === id)!;
  }

  private findInvoices(id: string) {
    return this.allInvoices.find(inv => inv.invoice_id === id);
  }
}
  



