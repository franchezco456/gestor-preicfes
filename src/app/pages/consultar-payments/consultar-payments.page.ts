import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Data } from 'src/app/core/services/data/data';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Loading } from 'src/app/core/services/loading/loading';
import { Payment, Student } from 'src/domain/models/index';

@Component({
  selector: 'app-consultar-payments',
  templateUrl: './consultar-payments.page.html',
  styleUrls: ['./consultar-payments.page.scss'],
  standalone: false,
})
export class ConsultarPaymentsPage implements OnInit {
  private allStudents: Student[] = [];
  private allPayments: Payment[] = [];
  public filteredResults: any[] = [];
  private studentsSubscription?: Subscription;
  private paymentsSubscriptions?: Subscription;
  public searchQuery: string = '';


  async ionViewWillEnter() {
    await this.loadData();
  }
  constructor(
    private readonly preferencesSrv: Preferences,
    private readonly dataSrv: Data,
    private readonly router: Router,
    private readonly loadingSrv: Loading
  ) { }

  async ngOnInit() {
    this.studentsSubscription = this.dataSrv.students$.subscribe(students => {
      this.allStudents = students;
    });

    this.paymentsSubscriptions = this.dataSrv.payments$.subscribe(payments => {
      this.allPayments = payments;
    })
  }

  ngOnDestroy() {
    this.studentsSubscription?.unsubscribe();
    this.paymentsSubscriptions?.unsubscribe();
  }

  private formatCurrency(value: number): string {
    return `COP ${value.toLocaleString('es-CO')}`;
  }

  private async loadData() {

    try {
      await this.loadingSrv.showLoading();
      const coord = await this.preferencesSrv.getPreferences('coordData');
      const existStudents = this.dataSrv.currentStudents.length > 0;
      if (!existStudents) {
        await this.loadStudents(coord);
      }

      const existPayments = this.dataSrv.currentPayments.length > 0;
      if (!existPayments) {
        await this.loadPayments(coord);
      }
      this.mapPaymentsOptions();


      console.log('[Pagos] Suscrito a estudiantes, total =', this.allStudents);
      console.log('[Pagos] Suscrito a pagos, total =', this.allPayments);
    } catch (error) {
      console.error('[ERROR] Fallo al cargar datos', error);
    } finally {
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

  private async loadPayments(coord: any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      await this.dataSrv.loadPayments({ id_IE: id_IE });
    } else {
      await this.dataSrv.loadPayments({});
    }
  }

  private mapPaymentsOptions() {
    this.filteredResults = this.allPayments.map(pago => {
      const student = this.allStudents.find(s => s.id_student === pago.invoice_id);
      const fullName = student ? `${student.name} ${student.lastname}` : 'Estudiante Desconocido';
      return {
        title: fullName,
        detail: this.formatCurrency(pago.payment_value),
        button: pago.payment_id
      };
    });
  }

  public async onSearchInput(value: string) {
    this.searchQuery = value ?? '';
    const q = (this.searchQuery || '').trim().toLowerCase();
    console.log('[Pagos] onSearchInput query =', q);
    if (!q) {
      this.mapPaymentsOptions();
      return;
    }

    this.filteredResults = this.allPayments
      .map(pago => {
        const student = this.allStudents.find(s => s.id_student === pago.invoice_id);
        const fullName = student ? `${student.name} ${student.lastname}` : 'Estudiante Desconocido';
        return {
          title: fullName,
          detail: this.formatCurrency(pago.payment_value),
          button: pago.payment_id
        };
      })
      .filter((item) =>
        (item.title || '').toLowerCase().includes(q) ||
        (item.detail || '').toLowerCase().includes(q) ||
        (item.button || '').toLowerCase().includes(q)
      );
    console.log('[Pagos] Filtrados', this.filteredResults.length, 'pagos para query =', q);
  }

  public goToPaymentDetail(item: any) {
    console.log('[Home] Selected search item:', item);
    console.log('[Home] Navegando a /detalles-pagos/', item.button);
    this.router.navigate(['/detalles-pagos/', item.button]);
  }
}
