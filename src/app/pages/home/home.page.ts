import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Query } from 'src/app/core/services/query/query';
import { ChartService } from 'src/app/shared/services/chart/chart-service';
import { PaymentStatusData } from 'src/domain/models';

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
  ionViewWillEnter(): void {
    this.fetchStudents();
  }

  private allStudents: StudentModel[] = [];
  public filteredResults: StudentModel[] = [];
  public searchQuery: string = '';


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

  ngOnInit(): void {
    this.initializeChart();
    this.fetchStudents();
  }
  

  private initializeChart(): void {
    const datosDePagos: PaymentStatusData[] = [
      { status: 'Paid', count: 80000, label: 'Pago 1' },
      { status: 'Pending', count: 120000, label: 'Pago 2' },
      { status: 'Not Paid', count: 50000, label: 'Pago 3' },
    ];

    const barData = datosDePagos.map((d) => ({ x: d.label, y: d.count }));
    this.studentPagos = this.chartSrv.createBarChart(
      barData,
      {
        title: 'Estado de Pagos',
        colors: ['#008FFB', '#00E396', '#FF4560'],
        height: 350,
        legendPosition: 'top',
        xAxisTitle: 'Pago',
        yAxisTitle: 'Valor',
      }
    );
  }

  private async fetchStudents(){
    try {
      const coord = await this.preferencesSrv.getPreferences('coordData');
        console.log(coord);
        const id_IE = coord.coordData.id_IE_Cicle;
        
        console.log('[Home] id_IE_Cicle =', id_IE);
        const list: any[] = await this.querySrv.execute_Function('get_students_by_ie_cicle', {p_id_ie_cicle: id_IE})
        this.allStudents = Array.isArray(list) ? list.map(r => ({

          TI: r.id_estudiante_out ?? '',
          DocumentType: r.documento_tipo_out ?? 'TI',
          Name: r.nombre_out ?? '',
          LastName: r.apellido_out ?? '',
          Email: r.email_out ?? '',
          Address: r.direccion_out ?? '',
          Grade: r.grado_out ??'',

        })) : [];
    } catch (error) {
      console.error('[ERROR] Fallo carga de estudiantes', error);
      this.allStudents = [];
    }
  }

  public selectSearchResult(item: StudentModel) {
    console.log('[Home] Selected search item:', item);
    this.searchQuery = `${item.Name} ${item.LastName}`;
    this.filteredResults = [];
    console.log('[Home] Navegando a /detalles-estudiante/', item.TI);
    this.router.navigate(['/detalles-estudiante', item.TI]);
  }

  @ViewChild('sidebar', { static: false }) sidebar?: SidebarComponent;

  public async toggleMenu() {
    if (!this.sidebar) return;
    await this.sidebar.toggle();
  }

  constructor(
    private readonly authSrv: Auth,
    public readonly querySrv: Query,
    private readonly chartSrv: ChartService,
    private readonly preferencesSrv: Preferences,
    private readonly router: Router,

  ) { }

  public async execute() {
    const email_param: string = 'q@q.com';
    const response = await this.querySrv.execute_Function('is_coordinator', {
      email_param: email_param,
    });
    console.log(response);
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

  public gotoRC() {
    this.router.navigate(['/form-coordinadores']);
  }

  public gotoRI() {
    this.router.navigate(['/form-instituciones']);
  }

  public goToRegisterPayment() {
    this.router.navigate(['/form-pagos']);
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
}
