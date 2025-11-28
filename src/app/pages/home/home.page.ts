import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Query } from 'src/app/core/services/query/query';
import { ChartService } from 'src/app/shared/services/chart/chart-service';
import { Loading } from '../../core/services/loading/loading';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Data } from 'src/app/core/services/data/data';
import { Student, Payment, Invoices } from 'src/domain/models/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  public studentPagos: any;
  @ViewChild(ChartComponent, { static: false }) chartCmp?: ChartComponent;
  async ionViewWillEnter() {
    await this.loadData();
    this.loading = false;
  }
  private studentsSubscription?: Subscription;
  private invoicesSubscription?: Subscription;
  private paymentsSubscription?: Subscription;
  private allStudents: Student[] = [];
  public allPayments: Payment[] = [];
  public allInvoices: Invoices[] = [];
  public dataList: any[] = [];
  public filteredResults: Student[] = [];
  public searchQuery: string = '';
  public loading = true;

  constructor(
    private readonly authSrv: Auth,
    public readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly chartSrv: ChartService,
    private readonly preferencesSrv: Preferences,
    private readonly dataSrv: Data,
    private readonly router: Router,

  ) { }

  ngOnInit(): void {
    this.studentsSubscription = this.dataSrv.students$.subscribe(students => {
      this.allStudents = students;
    });

    this.paymentsSubscription = this.dataSrv.payments$.subscribe(payments => {
      this.allPayments = payments;
    });
    this.invoicesSubscription = this.dataSrv.invoices$.subscribe(invoices => {
      this.allInvoices = invoices;
    });

    console.log('[Home] Suscrito a estudiantes, total =', this.allStudents);
    this.filterControl.valueChanges.subscribe(val => {
      if (val && val !== this.filterType) {
        this.setFilterType(val);
      }
    });
  }

  ngOnDestroy(): void {
    this.studentsSubscription?.unsubscribe();
    this.paymentsSubscription?.unsubscribe();
    this.invoicesSubscription?.unsubscribe();
  }

  // explicado en detalle estudiante
  public onFabAction(action: any) {
    const id = typeof action === 'string' ? action : (action?.id ?? '');
    switch (id) {
      case 'estudiante':
        this.gotoRE();
        break;
      case 'pago':
        this.goToRegisterPayment();
        break;
      case 'logout':
        this.logout();
        break;
      default:
        break;
    }
  }

  public async logout() {
    const logout = await this.authSrv.logout();
    console.log('TAG: LOGOUT' + JSON.stringify(logout));
    await this.preferencesSrv.clearPreferences();
    this.router.navigate(['/login']);
  }

  public gotoRE() {
    this.router.navigate(['/form-estudiantes']);
  }

  public goToRegisterPayment() {
    this.router.navigate(['/form-pagos']);
  }

  public selectSearchResult(item: Student) {
    console.log('[Home] Selected search item:', item);
    this.searchQuery = '';
    this.filteredResults = [];
    console.log('[Home] Navegando a /detalles-estudiante/', item.id_student);
    this.router.navigate(['/detalles-estudiante', item.id_student]);
  }

  public async onSearchInput(value: string) {
    this.searchQuery = value ?? '';
    const q = (this.searchQuery || '').trim().toLowerCase();
    console.log('[Home] onSearchInput query =', q);
    if (!q) {
      this.filteredResults = [];
      return;
    }

    this.filteredResults = this.allStudents.filter((s) =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.lastname || '').toLowerCase().includes(q) ||
      (s.id_student || '').toLowerCase().includes(q)
    );
    console.log('[Home] Filtrados', this.filteredResults.length, 'estudiantes para query =', q);
  }


  public kpis: Array<{ value: string | number; label: string }> = [];
  public coordinatorName: string = '';
  public filterType: 'dia' | 'mes' | 'año' = 'mes';
  public filterControl = new FormControl<'dia' | 'mes' | 'año'>(this.filterType);

  private readonly FILTER_CONFIG = {
    dia: {
      label: 'Diario',
      formatLabel: (date: string) => date ? new Date(date).toLocaleDateString('es-CO') : 'Sin fecha'
    },
    mes: {
      label: 'Mensual',
      formatLabel: (date: string) => {
        if (!date) return 'Sin fecha';
        try {
          const d = new Date(date);
          if (isNaN(d.getTime())) return 'Fecha Inválida';

          const monthName = d.toLocaleString('es-CO', { month: 'short' }).replace('.', '');
          return (monthName.charAt(0).toUpperCase() + monthName.slice(1)).substring(0, 3);
        } catch (e) {
          return 'Error';
        }
      }
    },
    año: {
      label: 'Anual',
      formatLabel: (date: string) => date ? new Date(date).getFullYear().toString() : 'Sin fecha'
    }
  } as const;

  private formatCurrency(value: number): string {
    return `COP ${value.toLocaleString('es-CO')}`;
  }

  public async setFilterType(type: 'dia' | 'mes' | 'año') {
    if (this.filterType !== type) {
      this.filterType = type;
      await this.updateChartByFilter();
    }
  }

  private async loadData() {
    try {
      await this.loadingSrv.showLoading();
      const coord = await this.preferencesSrv.getPreferences('coordData') ?? null;

      this.setCoordinatorName(coord);
      const existsStudents = this.dataSrv.currentStudents.length > 0;
      if (!existsStudents) {
        await this.loadStudents(coord);
      }
      await this.loadInvoices(coord);
      const existsPayments = this.dataSrv.currentPayments.length > 0;
      if (!existsPayments) {
        await this.loadPayments(coord);
        await this.mapPaymentsOptions();
      } else {
        await this.mapPaymentsOptions();
      }



      await this.updateChartByFilter();
      this.updateKpis();

      await this.loadingSrv.dismissLoading();
    } catch (error) {
      console.error('[ERROR] Fallo al cargar datos', error);
      await this.loadingSrv.dismissLoading();
    }
  }


  private loadStudents(coord: any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      return this.dataSrv.loadStudents({ id_IE: id_IE });
    } else {
      return this.dataSrv.loadStudents({});
    }
  }
  private loadInvoices(coord: any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      return this.dataSrv.loadInvoices({ id_IE: id_IE });
    } else {
      return this.dataSrv.loadInvoices({});
    }
  }

  private loadPayments(coord: any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      return this.dataSrv.loadPayments({ id_IE: id_IE });
    } else {
      return this.dataSrv.loadPayments({});
    }
  }

  private setCoordinatorName(coord: any) {
    if (!coord) {
      this.coordinatorName = '';
      return;
    }
    const data = coord.coordData || coord;
    const name = data.Name || '';
    const lastName = data.LastName || '';
    this.coordinatorName = `${name} ${lastName}`.trim();
  }
  private async mapPaymentsOptions() {
    this.dataList = this.allPayments.map(pago => {
      const student = this.allStudents.find(s => s.id_student === pago.invoice_id);
      const fullName = student ? `${student.name} ${student.lastname}` : 'Estudiante Desconocido';

      return {
        title: fullName,
        detail: this.formatCurrency(pago.payment_value),
        button: pago.payment_id
      };
    });
  }

  //para actualizar los kpis, muestra la suma de los pagos realizados, saldo pendiente, total estudiantes
  private updateKpis() {
    const totalEstudiantes = this.allStudents.length;
    const pagosRealizados = this.allPayments.length;
    const saldoPendienteTotal = this.allInvoices.reduce((acc, invoice) => acc + (Number(invoice.remaining_debt) || 0), 0);
    const ingresosTotales = this.allPayments.reduce((acc, pago) => acc + pago.payment_value, 0);

    const saldoPendienteFinal = Math.max(0, saldoPendienteTotal);
    this.kpis = [
      { value: totalEstudiantes, label: 'Estudiantes' },
      { value: this.formatCurrency(saldoPendienteFinal), label: 'Saldo pendiente' },
      { value: pagosRealizados, label: 'Pagos realizados' },
      { value: this.formatCurrency(ingresosTotales), label: 'Ingresos (total)' },
    ];
  }

  //para agrupar pagos por dia, mes o año
  private groupPaymentsBy(type: 'dia' | 'mes' | 'año') {
    const groups: Record<string, number> = {};

    for (const pago of this.allPayments) {
      const date = pago.payment_date;
      if (!date) continue;

      const key = this.FILTER_CONFIG[type].formatLabel(date);
      const value = pago.payment_value;
      groups[key] = (groups[key] || 0) + value;
    }

    return Object.entries(groups).map(([label, count]) => ({ label, count }));
  }
  //para actualizar las graficas 
  public async updateChartByFilter() {
    const data = this.groupPaymentsBy(this.filterType);
    const config = this.FILTER_CONFIG[this.filterType];

    this.studentPagos = await this.chartSrv.createBarChart(
      data.map(d => ({ x: d.label, y: d.count })),
      {
        title: `Pagos agrupados por ${config.label.toLowerCase()}`,
        colors: ['#008FFB', '#00E396', '#FF4560'],
        height: 350,
        legendPosition: 'top',
        xAxisTitle: config.label,
        yAxisTitle: 'Total Pagado',
      }
    );
  }

  //para ir a detalles estudiante pero desde la lista de pagos (hay que editar)
  public goToPaymentDetail(item: any) {
    console.log('[Home] Navegando a /detalles-pagos/', item.button);
    this.loading = true;
    this.router.navigate(['/detalles-pagos', item.button]);
  }

  public gotoSearchPayments() {
    this.router.navigate(['/consultar-payments']);
  }

  public async handleRefresh(event: any) {
    const coord = await this.preferencesSrv.getPreferences('coordData') ?? null;
    if (coord) {
      const params = { id_IE_Cicle: coord?.coordData?.id_IE_Cicle };
      await Promise.all([
        this.dataSrv.loadInstitutions(params),
        this.dataSrv.loadInvoices({ id_IE: params.id_IE_Cicle }),
        this.dataSrv.loadPayments({ id_IE: params.id_IE_Cicle }),
        this.dataSrv.loadStudents({ id_IE: params.id_IE_Cicle })
      ]);
    } else {
      await Promise.all([
        this.dataSrv.loadInstitutions({}),
        this.dataSrv.loadInvoices({}),
        this.dataSrv.loadPayments({}),
        this.dataSrv.loadStudents({})
      ]);
    }

    await this.mapPaymentsOptions(); 
    this.updateKpis();              
    await this.updateChartByFilter();

    event.target.complete();

  }
}
