import { Component, ViewChild, OnInit } from '@angular/core';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Query } from 'src/app/core/services/query/query';
import { Institution } from 'src/app/shared/services/institution/institution';
import { Institution as In } from 'src/domain/models/Institution';
import { ChartService } from 'src/app/shared/services/chart/chart-service';
import { PaymentStatusData } from 'src/domain/models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public studentPagos: any;

  // Searchbar related (mirrors functionality from form-pagos)
  // We use a small inline typing shape for results displayed by the searchbar

  public searchData: { Name: string; LastName: string; ID: string }[] = [
    { Name: 'fulanito', LastName: 'de tal', ID: '1234' },
    { Name: 'fulanito2', LastName: 'de tal2', ID: '12345' },
    { Name: 'Rafa', LastName: 'Mallarino', ID: '1042576911' },
  ];
  public filteredResults: { Name: string; LastName: string; ID: string }[] = [];
  public searchQuery: string = '';

  public onSearchInput(value: string) {
    this.searchQuery = value ?? '';
    const q = (this.searchQuery || '').trim().toLowerCase();
    if (!q) {
      this.filteredResults = [];
      return;
    }
    this.filteredResults = this.searchData.filter(
      (item) =>
        item.Name.toLowerCase().includes(q) ||
        item.LastName.toLowerCase().includes(q) ||
        item.ID.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    const datosDePagos: PaymentStatusData[] = [
      { status: 'Paid', count: 80000, label: 'Pago 1' },
      { status: 'Pending', count: 120000, label: 'Pago 2' },
      { status: 'Not Paid', count: 50000, label: 'Pago 3' },
    ];
    this.studentPagos = this.chartSrv.createPieChart(
      datosDePagos.map((d) => d.count),
      datosDePagos.map((d) => d.label),

      {title: 'Estado de Pagos', colors: ['#008FFB', '#00E396', '#FF4560'], height: 350, legendPosition: 'top'}
    );
  }

  public selectSearchResult(item: {
    Name: string;
    LastName: string;
    ID: string;
  }) {
    // Navigate to detalles-estudiante and pass the selected item as navigation state
    console.log('Selected search item on Home:', item);
    const studentForDetails = {
      nombre: item.Name,
      apellido: item.LastName,
      identificacion: item.ID,
      // keep other fields empty; detalles page will fallback if needed
      correo: '',
      direccion: '',
      institucion: '',
      estado: '',
      grado: '',
    };
    this.searchQuery = `${item.Name} ${item.LastName}`;
    this.filteredResults = [];
    // Use router navigation extras state to pass the object to the details page
    this.router.navigate(['/detalles-estudiante'], {
      state: { student: studentForDetails },
    });
  }

  @ViewChild('sidebar', { static: false }) sidebar?: SidebarComponent;

  public async toggleMenu() {
    if (!this.sidebar) return;
    await this.sidebar.toggle();
  }

  constructor(
    private readonly authSrv: Auth,
    private readonly institutionSrv: Institution,
    public readonly querySrv: Query,
    private readonly chartSrv: ChartService,
    private readonly preferencesSrv: Preferences,
    private readonly router: Router
  ) {}

  public async go() {
    const register = await this.authSrv.register('hello1@gmail.com', 'world2');
    console.log('TAG: REGISTER' + JSON.stringify(register));

    const login = await this.authSrv.login('hello1@gmail.com', 'world2');
    console.log('TAG: LOGIN' + JSON.stringify(login));
    const uni: In = {
      NIT: '12345',
      Name: 'la salle',
      Address: 'bicentenario',
      Course_Value: 500000,
    };
    const uni2: In = {
      NIT: '123456',
      Name: 'la salle',
      Address: 'la popa',
      Course_Value: 350000,
    };
    const uni3: In = {
      NIT: '1234567',
      Name: 'inem',
      Address: 'el bosque',
      Course_Value: 150000,
    };

    const filter_delete_uni = {
      NIT: '123456',
    };

    let filters = {
      NIT: '12345',
      Name: '',
      Address: '',
      Course_Value: null,
    };

    let new_uni = {
      NIT: '',
      Name: 'nueva selanda',
      Address: '',
      Course_Value: 0,
    };

    const create = await this.institutionSrv.addInstitution(uni);
    console.log('TAG: CREATE' + JSON.stringify(create));

    const create2 = await this.institutionSrv.addInstitution(uni2);
    console.log('TAG: CREATE' + JSON.stringify(create2));

    const create3 = await this.institutionSrv.addInstitution(uni3);
    console.log('TAG: CREATE' + JSON.stringify(create3));

    const update = await this.institutionSrv.updateInstitution(
      filters,
      new_uni
    );
    console.log('TAG: UPDATE' + JSON.stringify(update));

    const deletes = await this.institutionSrv.deleteInstitution(
      filter_delete_uni
    );
    console.log('TAG: DELETE' + JSON.stringify(deletes));

    const getOne = await this.institutionSrv.getInstitution(filters);
    console.log('TAG: GET ONE' + JSON.stringify(getOne));

    const getAll = await this.institutionSrv.getAllInstitutions();
    console.log('TAG: GET ALL' + JSON.stringify(getAll));
  }

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
    await this.preferencesSrv.removePreferences('login');
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
}
