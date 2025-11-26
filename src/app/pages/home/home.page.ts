import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Query } from 'src/app/core/services/query/query';
import { ChartService } from 'src/app/shared/services/chart/chart-service';
import { PaymentStatusData } from 'src/domain/models';
import { Loading } from '../../core/services/loading/loading';
import { FormControl } from '@angular/forms';

type StudentModel = { TI: string; DocumentType: string; Name: string; LastName: string; Email: string; Address: string; Grade: string };

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public studentPagos: any;
  @ViewChild(ChartComponent, { static: false }) chartCmp?: ChartComponent;
  ionViewWillEnter() {
    this.loadData();
  }

  private allStudents: StudentModel[] = [];
  public filteredResults: StudentModel[] = [];
  public searchQuery: string = '';
  public payments: any[] = [];
  public invoices: any[] = [];

  @ViewChild('sidebar', { static: false }) sidebar?: SidebarComponent;

  constructor(
    private readonly authSrv: Auth,
    public readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly chartSrv: ChartService,
    private readonly preferencesSrv: Preferences,
    private readonly router: Router,

  ) { }

  ngOnInit(): void {
    this.filterControl.valueChanges.subscribe(val => {
      if (val && val !== this.filterType) {
        this.setFilterType(val);
      }
    });
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

  public async toggleMenu() {
    if (!this.sidebar) return;
    await this.sidebar.toggle();
  }

  public async fetchPayments() {
    try {
      const coord = await this.preferencesSrv.getPreferences('coordData');
      console.log(coord);
      const id_IE = coord.coordData.id_IE_Cicle;
      const list: any[] = await this.querySrv.execute_Function('get_payments', { id_ie: id_IE })
      this.payments = Array.isArray(list) ? list.map(r => ({
        title: r.student_name,
        date: new Date(r.payment_date),
        value: r.payment_value,
        detail: `Fecha : ${r.payment_date} / Valor : ${r.payment_value}`,
        button: r.payment_id,
        id: r.invoice_id,
        remaining_debt: r.remaining_debt
      })) : [];
    } catch (error) {
      console.error('[ERROR] Fallo carga de pagos', error);
      this.payments = [];
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

        TI: r.invoice_id_out ?? '',
        DocumentType: r.documento_tipo_out ?? 'TI',
        Name: r.nombre_out ?? '',
        LastName: r.apellido_out ?? '',
        Email: r.email_out ?? '',
        Address: r.direccion_out ?? '',
        Grade: r.grado_out ?? '',

      })) : [];
    } catch (error) {
      console.error('[ERROR] Fallo carga de estudiantes', error);
      this.allStudents = [];
    }
  }

  public selectSearchResult(item: StudentModel) {
    console.log('[Home] Selected search item:', item);
    this.searchQuery = '';
    this.filteredResults = [];
    console.log('[Home] Navegando a /detalles-estudiante/', item.TI);
    this.router.navigate(['/detalles-estudiante', item.TI]);
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
      (s.Name || '').toLowerCase().includes(q) ||
      (s.LastName || '').toLowerCase().includes(q) ||
      (s.TI || '').toLowerCase().includes(q)
    );
    console.log('[Home] Filtrados', this.filteredResults.length, 'estudiantes para query =', q);
  }

  //Jesus Work

  public kpis: Array<{ value: string | number; label: string }> = [];
  public coordinatorName: string = '';
  public filterType: 'dia' | 'mes' | 'año' = 'mes';
  public filterControl = new FormControl<'dia' | 'mes' | 'año'>(this.filterType);
  public tabButtons = [
    { icon: 'home-outline', route: '/home', aria: 'Inicio' },
    { icon: 'people-outline', route: '/form-estudiantes', aria: 'Estudiantes' },
    { icon: 'card-outline', route: '/form-pagos', aria: 'Pagos' },
  ];

  private readonly FILTER_CONFIG = {
    dia: { label: 'Día', format: (d: Date) => d.toISOString().slice(0, 10) },
    mes: { label: 'Mes', format: (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` },
    año: { label: 'Año', format: (d: Date) => String(d.getFullYear()) }
  } as const;

  private formatCurrency(value: number): string {
    return `COP ${value.toLocaleString('es-CO')}`;
  }

   public setFilterType(type: 'dia' | 'mes' | 'año') {
    if (this.filterType !== type) {
      this.filterType = type;
      this.updateChartByFilter();
    }
  }

  private async loadData() {
    this.loadingSrv.showLoading();
    try {
      const coord = await this.preferencesSrv.getPreferences('coordData');
      // Obtener nombre y apellido del coordinador
      if (coord && coord.coordData) {
        const name = coord.coordData.Name || '';
        const lastName = coord.coordData.LastName || '';
        this.coordinatorName = `${name} ${lastName}`.trim();
      }

      //cargar los datos
      await Promise.all([
        this.fetchPayments(),
        this.fetchStudents()
      ]);

      const id_IE = coord.coordData.id_IE_Cicle;
      const invoicesList: any[] = await this.querySrv.execute_Function('get_invoices', { id_ie: id_IE });
      this.invoices = Array.isArray(invoicesList) ? invoicesList : [];

      //actualizar graficas y KPI
      this.updateChartByFilter();
      this.updateKpis();
    } catch (error) {
      console.error('[ERROR] Fallo al cargar datos', error);
    } finally {
      await this.loadingSrv.dismissLoading();
    }
  }

  //para actualizar los kpis, muestra la suma de los pagos realizados, saldo pendiente, total estudiantes
  private updateKpis() {
    const totalEstudiantes = this.allStudents.length;
    const pagosRealizados = this.payments.length;
    const saldoPendienteTotal = this.invoices.reduce((acc, invoice) => acc + (Number(invoice.remaining_debt) || 0), 0);
    const ingresosTotales = this.payments.reduce((acc, pago) => acc + pago.value, 0);

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

    for (const pago of this.payments) {
      const date = pago.date;
      if (!date) continue;

      const key = this.FILTER_CONFIG[type].format(date);
      const value = pago.value;
      groups[key] = (groups[key] || 0) + value;
    }

    return Object.entries(groups).map(([label, count]) => ({ label, count }));
  }
//para actualizar las graficas 
  public updateChartByFilter() {
    const data = this.groupPaymentsBy(this.filterType);
    const config = this.FILTER_CONFIG[this.filterType];

    this.studentPagos = this.chartSrv.createBarChart(
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
   public goToStudentDetail(item: any) {
    console.log('[Home] Selected search item:', item);
    console.log('[Home] Navegando a /detalles-estudiante/', item.id);
    this.router.navigate(['/detalles-estudiante', item.id]);
  }
}
