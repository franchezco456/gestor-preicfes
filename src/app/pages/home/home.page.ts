import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Auth } from 'src/app/core/services/auth/auth';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Query } from 'src/app/core/services/query/query';
import { ChartService } from 'src/app/shared/services/chart/chart-service';
import { PaymentStatusData } from 'src/domain/models';
import { Student } from 'src/domain/models/Student';
import { Loading } from '../../core/services/loading/loading';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public kpis: Array<{ value: string | number; label: string }> = [];
  public coordinatorName: string = '';

  public tabButtons = [
    { icon: 'home-outline', route: '/home', aria: 'Inicio' },
    { icon: 'people-outline', route: '/form-estudiantes', aria: 'Estudiantes' },
    { icon: 'card-outline', route: '/form-pagos', aria: 'Pagos' },
  ];

  public studentPagos: any;
  public filterType: 'dia' | 'mes' | 'año' = 'mes';
  public filterControl = new FormControl<'dia' | 'mes' | 'año'>(this.filterType);
  public searchQuery: string = '';
  public filteredResults: Student[] = [];
  public payments: any[] = [];
  private allStudents: Student[] = [];

  private readonly FILTER_CONFIG = {
    dia: { label: 'Día', format: (d: Date) => d.toISOString().slice(0, 10) },
    mes: { label: 'Mes', format: (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` },
    año: { label: 'Año', format: (d: Date) => String(d.getFullYear()) }
  } as const;

  @ViewChild(ChartComponent, { static: false }) chartCmp?: ChartComponent;
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

  ionViewWillEnter() {
    this.loadData();
  }

  private async loadData() {
    this.loadingSrv.showLoading();
    try {
      const coord = await this.preferencesSrv.getPreferences('coordData');
      const id_IE = coord.coordData.id_IE_Cicle;
      // Obtener nombre y apellido del coordinador
      if (coord && coord.coordData) {
        const name = coord.coordData.Name || '';
        const lastName = coord.coordData.LastName || '';
        this.coordinatorName = `${name} ${lastName}`.trim();
      }

      await Promise.all([
        this.fetchPayments(id_IE),
        this.fetchStudents(id_IE)
      ]);

      this.updateChartByFilter();
      this.updateKpis();
    } catch (error) {
      console.error('[ERROR] Fallo al cargar datos', error);
    } finally {
      this.loadingSrv.dismissLoading();
    }
  }

  private async fetchStudents(id_IE: string) {
    try {
      console.log('[Home] id_IE_Cicle =', id_IE);
      const list: any[] = await this.querySrv.execute_Function('get_students_by_ie_cicle', {
        p_id_ie_cicle: id_IE
      });

      this.allStudents = Array.isArray(list) ? list.map(r => ({
        id: r.invoice_id_out ?? '',
        document_type: r.documento_tipo_out ?? 'TI',
        Name: r.nombre_out ?? '',
        LastName: r.apellido_out ?? '',
        Email: r.email_out ?? '',
        Address: r.direccion_out ?? '',
        id_IE: r.id_ie_out ?? '',
        Grade: r.grado_out ?? '',
        cicle_id: r.cicle_id ?? r.id_ciclo ?? '',
      })) : [];
    } catch (error) {
      console.error('[ERROR] Fallo carga de estudiantes', error);
      this.allStudents = [];
    }
  }

  private async fetchPayments(id_IE: string) {
    try {
      const list: any[] = await this.querySrv.execute_Function('get_payments', { id_ie: id_IE });

      this.payments = Array.isArray(list) ? list.map(r => ({
        title: r.student_name,
        detail: `Fecha : ${r.payment_date} / Valor : ${r.payment_value}`,
        button: r.payment_id,
        studentId: r.invoice_id,
        remaining_debt: r.remaining_debt ?? 0
      })) : [];
    } catch (error) {
      console.error('[ERROR] Fallo carga de pagos', error);
      this.payments = [];
    }
  }

  private updateKpis() {

    const totalEstudiantes = this.allStudents.length;
    const pagosRealizados = this.payments.length;
    const { ingresosTotales, saldoPendienteTotal } = this.payments.reduce(
      (acc, pago) => ({
        ingresosTotales: acc.ingresosTotales + this.extractValue(pago.detail),
        saldoPendienteTotal: acc.saldoPendienteTotal + (Number(pago.remaining_debt) || 0)
      }),
      { ingresosTotales: 0, saldoPendienteTotal: 0 }
    );

    const saldoPendienteFinal = Math.max(0, saldoPendienteTotal);

    this.kpis = [
      { value: totalEstudiantes, label: 'Estudiantes' },
      { value: this.formatCurrency(saldoPendienteFinal), label: 'Saldo pendiente' },
      { value: pagosRealizados, label: 'Pagos realizados' },
      { value: this.formatCurrency(ingresosTotales), label: 'Ingresos (total)' },
    ];
  }

  private formatCurrency(value: number): string {
    return `COP ${value.toLocaleString('es-CO')}`;
  }

  private groupPaymentsBy(type: 'dia' | 'mes' | 'año') {
    const groups: Record<string, number> = {};

    for (const pago of this.payments) {
      const date = this.extractDate(pago.detail);
      if (!date) continue;

      const key = this.FILTER_CONFIG[type].format(date);
      const value = this.extractValue(pago.detail);
      groups[key] = (groups[key] || 0) + value;
    }

    return Object.entries(groups).map(([label, count]) => ({ label, count }));
  }

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

  public setFilterType(type: 'dia' | 'mes' | 'año') {
    if (this.filterType !== type) {
      this.filterType = type;
      this.updateChartByFilter();
    }
  }

  private extractDate(detail: string): Date | null {
    const match = detail.match(/Fecha ?: ?([\d\-T: ]+)/);
    if (!match?.[1]) return null;

    const date = new Date(match[1]);
    return isNaN(date.getTime()) ? null : date;
  }

  private extractValue(detail: string): number {
    const match = detail.match(/Valor ?: ?([\d.]+)/);
    return match?.[1] ? parseFloat(match[1].replace(/\./g, '')) : 0;
  }

  public async onSearchInput(value: string) {
    const q = (value || '').trim().toLowerCase();
    this.searchQuery = q;
    console.log('[Home] onSearchInput query =', q);

    if (!q) {
      this.filteredResults = [];
      return;
    }

    this.filteredResults = this.allStudents.filter(s =>
      [s.Name, s.LastName, s.id].some(field =>
        (field || '').toLowerCase().includes(q)
      )
    );

    console.log('[Home] Filtrados', this.filteredResults.length, 'estudiantes para query =', q);
  }

  public selectSearchResult(student: Student) {
    console.log('[Home] Selected search item:', student);
    this.searchQuery = '';
    this.filteredResults = [];
    console.log('[Home] Navegando a /detalles-estudiante/', student.id);
    this.router.navigate(['/detalles-estudiante', student.id]);
  }

  public goToStudentDetail(item: any) {
    console.log('[Home] Selected search item:', item);
    console.log('[Home] Navegando a /detalles-estudiante/', item.id);
    this.router.navigate(['/detalles-estudiante', item.studentId]);
  }

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
}