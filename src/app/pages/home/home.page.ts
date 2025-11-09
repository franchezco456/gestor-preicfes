import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { Preferences } from 'src/app/core/services/preferences/preferences';
import { Query } from 'src/app/core/services/query/query';
import { Institution } from 'src/app/shared/services/institution/institution';
import { Institution as In } from 'src/domain/models/Institution';
import { ChartService } from 'src/app/shared/services/chart/chart-service';
import { 
  PaymentData, 
  AccumulatedPaymentData, 
  StudentsByInstitutionData,
  PaymentStatusData,
  DistributionData
} from 'src/domain/models';

@Component({
  selector: 'app-home', 
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  public studentpago: any;
  public paymentsPorSaturday: any;
  public paymentsAcumulados: any;
  public institutionsDona: any;
  public studentsPorInstitucion: any;

  constructor(
    private readonly authSrv: Auth, 
    private readonly institutionSrv: Institution, 
    public readonly querySrv: Query,
    private readonly preferencesSrv: Preferences,
    private readonly router: Router,
    private readonly chartSrv: ChartService
  ) { }

  ngOnInit(): void {
    this.initializeCharts();
  }

  /*que necesitamos, un servicio que nos devuelva 1 serie de datos por pagos de estudiantes ejemplo en la
  base de datos debe de aver algo como estado de pago "en proceso", "pagado", "no pagado" y esos estados debemos traerlos
  de base de datos y colocarlos en 1*/ 

  private initializeCharts(): void {
    // Datos de estado de pagos usando la interfaz PaymentStatusData
    const paymentStatusData: PaymentStatusData[] = [
      { status: 'en proceso', count: 25, label: 'tan en proceso los chamos' },
      { status: 'pagado', count: 45, label: 'ya pagaron los colombianos' },
      { status: 'no pagado', count: 30, label: 'trabajan en el gobierno por eso no han pagado' }
    ];

    this.studentpago = this.chartSrv.createPieChart(
      paymentStatusData.map(d => d.count),
      paymentStatusData.map(d => d.label),
      {
        title: 'Estado de Pagos de Estudiantes',
        colors: ['orange', 'green', 'red'],
        height: 350,
        legendPosition: 'bottom'
      }
    );

    /*tambien necesitamos traer estos datos asi que no se si es necesario crear un servicio
    especificamente para los pagos, en base de datos debe de estar lo siguiente
    dia de pago y monto pagado ese dia*/

    // Datos de pagos por sábado usando la interfaz PaymentData
    const pagoData: PaymentData[] = [
      { date: '2025-11-01', amount: 2500000 },
      { date: '2025-11-08', amount: 3100000 },
      { date: '2025-11-15', amount: 2800000 },
      { date: '2025-11-22', amount: 3500000 },
      { date: '2025-11-29', amount: 2900000 },
      { date: '2025-12-06', amount: 4200000 },
      { date: '2025-12-13', amount: 3800000 },
      { date: '2025-12-20', amount: 3100000 }
    ];

    this.paymentsPorSaturday = this.chartSrv.createBarChart(
      pagoData,
      {
        title: 'Pagos por Sabado',
        subtitle: 'Monto (COP)',
        colors: ['blue'],
        xAxisTitle: 'Fecha',
        yAxisTitle: 'Monto (COP)'
      }
    );

    // Datos de pagos acumulados usando la interfaz AccumulatedPaymentData
    const acumuladoData: AccumulatedPaymentData[] = [
      { date: '2025-10-05', totalAmount: 2500000 },
      { date: '2025-10-12', totalAmount: 5600000 },
      { date: '2025-10-19', totalAmount: 8400000 },
      { date: '2025-10-26', totalAmount: 11900000 },
      { date: '2025-11-02', totalAmount: 14800000 },
      { date: '2025-11-09', totalAmount: 19000000 },
      { date: '2025-11-16', totalAmount: 22800000 },
      { date: '2025-11-23', totalAmount: 25900000 }
    ];

    this.paymentsAcumulados = this.chartSrv.createLineChart(
      acumuladoData,
      {
        title: 'Pagos Acumulados ',
        subtitle: 'Total Acumulado (COP)',
        colors: ['green'],
        xAxisTitle: 'Fecha',
        yAxisTitle: 'Total (COP)'
      }
    );

    // Datos de distribución usando la interfaz DistributionData
    const institutionsData: DistributionData[] = [
      { label: 'el rafa es gay', value: 500 },
      { label: 'el rafa no es gay', value: 100 }
    ];

    this.institutionsDona = this.chartSrv.createDonutChart(
      institutionsData.map(d => d.value),
      institutionsData.map(d => d.label),
      {
        title: '¿que tan gay es el rafa?',
        colors: ['purple', 'cyan'],
        height: 350,
        legendPosition: 'bottom'
      }
    );

    /*aqui tambien necesitamos traer de base de datos el nombre de la institucion 
    y cuantos estudiantes tiene cada una, entonces seria una consulta que agrupe
    los estudiantes por institucion y cuente cuantos hay en cada una*/
    const studentsPorInstitutionData: StudentsByInstitutionData[] = [
      { institutionName: 'mi casa', studentCount: 35 },
      { institutionName: 'La tuya', studentCount: 28 },
      { institutionName: 'el rafa es gay', studentCount: 42 }
    ];

    this.studentsPorInstitucion = this.chartSrv.createBarChart(
      studentsPorInstitutionData,
      {
        title: 'Estudiantes por Institucion',
        subtitle: 'Cantidad de Estudiantes',
        colors: ['teal'],
        xAxisTitle: 'Institucion',
        yAxisTitle: 'Numero de Estudiantes',
        height: 400
      }
    );
  }

  public async go() {
    const register = await this.authSrv.register("hello1@gmail.com", "world2");
    console.log("TAG: REGISTER" + JSON.stringify(register));

    const login = await this.authSrv.login("hello1@gmail.com", "world2");
    console.log("TAG: LOGIN" + JSON.stringify(login));
    const uni: In = {
      NIT: "12345",
      Name: "la salle",
      Address: "bicentenario",
      Course_Value: 500000
    }
    const uni2: In = {
      NIT: "123456",
      Name: "la salle",
      Address: "la popa",
      Course_Value: 350000
    }
    const uni3: In = {
      NIT: "1234567",
      Name: "inem",
      Address: "el bosque",
      Course_Value: 150000
    }

    const filter_delete_uni = {
      NIT: "123456"
    }

    let filters = {
      NIT: "12345",
      Name: "",
      Address: "",
      Course_Value: null
    }

    let new_uni = {
      NIT: "",
      Name: "nueva selanda",
      Address: "",
      Course_Value: 0
    }

    const create = await this.institutionSrv.addInstitution(uni);
    console.log("TAG: CREATE" + JSON.stringify(create));

    const create2 = await this.institutionSrv.addInstitution(uni2);
    console.log("TAG: CREATE" + JSON.stringify(create2));

    const create3 = await this.institutionSrv.addInstitution(uni3);
    console.log("TAG: CREATE" + JSON.stringify(create3));

    const update = await this.institutionSrv.updateInstitution(filters, new_uni);
    console.log("TAG: UPDATE" + JSON.stringify(update));

    const deletes = await this.institutionSrv.deleteInstitution(filter_delete_uni);
    console.log("TAG: DELETE" + JSON.stringify(deletes));

    const getOne = await this.institutionSrv.getInstitution(filters);
    console.log("TAG: GET ONE" + JSON.stringify(getOne));

    const getAll = await this.institutionSrv.getAllInstitutions();
    console.log("TAG: GET ALL" + JSON.stringify(getAll));
  }

  public async execute(){
    const email_param : string = "q@q.com";
    const response = await this.querySrv.execute_Function("is_coordinator", {email_param : email_param});
    console.log(response);
  }

  public async logout(){
    const logout = await this.authSrv.logout();
    console.log("TAG: LOGOUT" + JSON.stringify(logout));
    await this.preferencesSrv.removePreferences("login");
    this.router.navigate(["/login"]);
  }

  public gotoRE(){
    this.router.navigate(["/form-estudiantes"]);
  }

  public gotoRC(){
    this.router.navigate(["/form-coordinadores"]);
  }

  public gotoRI(){
    this.router.navigate(["/form-instituciones"]);
  }

  // daaa frankliiiiinnnnnn
  
  public testActualizacionTiempoRealPie(): void {
    const actualSeries = this.studentpago.series;
    this.studentpago = this.chartSrv.createPieChart(
      actualSeries.map((val: number) => val + 5),
      ['tan en proceso los chamos', 'ya pagaron los colombianos', 'trabajan en el gobierno por eso no han pagado'],
      { 
        title: 'Estado de Pagos de Estudiantes',
        colors: ['orange', 'green', 'red'], 
        height: 350, legendPosition: 'bottom'
       }
    );
  }

  public testActualizacionTiempoRealBar1(): void {
    const actualData = this.paymentsPorSaturday.series[0].data;
    this.paymentsPorSaturday = this.chartSrv.createBarChart(
      actualData.map((item: any) => ({ x: item.x, y: item.y + 500000 })),
      { 
        title: 'Pagos por Sabado',
        subtitle: 'Monto (COP)',
        colors: ['blue'],
        xAxisTitle: 'Fecha',
        yAxisTitle: 'Monto (COP)'
      }
    );
  }

  public testActualizacionTiempoRealLine(): void {
    const actualData = this.paymentsAcumulados.series[0].data;
    this.paymentsAcumulados = this.chartSrv.createLineChart(
      actualData.map((item: any) => ({ x: item.x, y: item.y + 1000000 })),
      { title: 'Pagos Acumulados ',
        subtitle: 'Total Acumulado (COP)',
        colors: ['green'],
        xAxisTitle: 'Fecha',
        yAxisTitle: 'Total (COP)'
      }
    );
  }

  public testActualizacionTiempoRealDonut(): void {
    const actualSeries = this.institutionsDona.series;
    this.institutionsDona = this.chartSrv.createDonutChart(
      actualSeries.map((val: number) => val + 50),
      ['el rafa es gay', 'el rafa no es gay'],
      { title: '¿que tan gay es el rafa?',
        colors: ['purple', 'cyan'],
        height: 350,
        legendPosition: 'bottom'
      }
    );
  }

  public testActualizacionTiempoRealBar(): void {
    const actualData = this.studentsPorInstitucion.series[0].data;
    this.studentsPorInstitucion = this.chartSrv.createBarChart(
      actualData.map((item: any) => ({ x: item.x, y: item.y + 10 })),
      { title: 'Estudiantes por Institucion',
        subtitle: 'Cantidad de Estudiantes',
        colors: ['teal'],
        xAxisTitle: 'Institucion',
        yAxisTitle: 'Numero de Estudiantes',
        height: 400
      }
    );
  }


}




