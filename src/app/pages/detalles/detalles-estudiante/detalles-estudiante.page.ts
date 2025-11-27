import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from 'src/app/core/services/query/query';
import { Loading } from 'src/app/core/services/loading/loading';
import { Toast } from 'src/app/core/services/toast/toast';
import { AlertController } from '@ionic/angular';
import { AlertCtrl } from 'src/app/core/services/alertControl/alert-ctrl';
import { Subscription } from 'rxjs';
import { Invoices, Student } from 'src/domain/models/index';
import { Data } from 'src/app/core/services/data/data';
import { Preferences } from 'src/app/core/services/preferences/preferences';

@Component({
  selector: 'app-detalles-estudiante',
  templateUrl: './detalles-estudiante.page.html',
  styleUrls: ['./detalles-estudiante.page.scss'],
  standalone: false,
})
export class DetallesEstudiantePage implements OnInit , OnDestroy {
  private studentsSubscription ?: Subscription;
  private invoicesSubscription ?: Subscription;
  public allStudents !: Student [];
  public allInvoices !: Invoices [];
  public student !: Student ;
  public invoiceSummary !: Invoices ;
  public loading = true;
  public notFound = false;

  async ionViewWillEnter() {
    await this.loadData();
  }
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast,
    private readonly alertSrv: AlertCtrl,
    private readonly dataSrv: Data,
    private readonly preferencesSrv : Preferences
  ) { }

  ngOnInit() {
    this.studentsSubscription = this.dataSrv.students$.subscribe(students => {
      this.allStudents = students;
    });

    this.invoicesSubscription = this.dataSrv.invoices$.subscribe(invoices => {
      this.allInvoices = invoices;
    })
  }

  ngOnDestroy() {
    this.studentsSubscription?.unsubscribe();
    this.invoicesSubscription?.unsubscribe();
  }
  public async loadData(){
    await this.loadingSrv.showLoading();
    const id = this.route.snapshot.paramMap.get('id');
    const coord = await this.preferencesSrv.getPreferences('coordData');
    const existStudents = this.dataSrv.currentStudents.length > 0;
    if(!id){
      this.notFound = true;
      this.loading = false;
      await this.loadingSrv.dismissLoading();
      return;
    }
    try {
      this.loading = true;
      if (!existStudents) {
        await this.loadStudents(coord);
        this.findStudent(id);
      }else{
        this.findStudent(id);
      }
      
      
      await this.loadInvoices(coord);
      this.findInvoice(id);
      

      if(!this.allStudents || this.allStudents.length === 0){
        this.notFound = true;
        return;
      }

      if(!this.allInvoices || this.allInvoices.length === 0){
        this.notFound = true;
        return;
      }

      
      
      console.log('[Pagos] Suscrito a estudiantes, total =', this.allStudents);
      console.log('[Pagos] Suscrito a facturas, total =', this.allInvoices);
      this.notFound = false;
      await this.loadingSrv.dismissLoading();
    } catch (error) {
      this.notFound = true;
      console.error('[ERROR] Fallo al cargar datos', error);
    }finally{
      this.loading = false;
      await this.loadingSrv.dismissLoading();
    }
  }

  private async loadStudents(coord : any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      await this.dataSrv.loadStudents({ id_IE: id_IE });
    } else {
      await this.dataSrv.loadStudents({});
    }
  }

  private findStudent(id : string) {
    this.student = this.allStudents.find(s => s.id_student === id)!;
  }

  private async loadInvoices(coord : any) {
    if (coord) {
      const data = coord.coordData || coord;
      const id_IE: string = data?.id_IE_Cicle;
      await this.dataSrv.loadInvoices({ id_IE: id_IE });
    } else {
      await this.dataSrv.loadInvoices({});
    }
  }

  private findInvoice(id : string) {
    this.invoiceSummary = this.allInvoices.find(i => i.invoice_id === id)!;
  }

  // Maneja las acciones del fab flotante
  public async onFabAction(action: any) {
    const id = typeof action === 'string' ? action : (action?.id ?? '');
    switch (id) {
      case 'editar':
        this.goToEdit();
        break;
      case 'eliminar':
        await this.deletedStudent();
        break;
      case 'pago':
        this.goToPay();
        break;
      default:
        break;
    }
  }

  public goToEdit() {
    this.router.navigate(['/actualizar-estudiante', this.student.id_student]);
  }

  public goToPay(){
    this.router.navigate(['/form-pagos', this.student.id_student]);
  }
  //eliminar estudiante
  public async deletedStudent() {
    const id = this.route.snapshot.paramMap.get('id');
    if (this.invoiceSummary.remaining_debt > 0) {
      await this.toastSrv.showErrorToast('No se pueden eliminar estudiantes con saldo pendiente.');
      return;
  }



    const confirmed = await this.alertSrv.confirm(
      `¿Está seguro que desea eliminar al estudiante?\n\nNombre: ${this.student.name} ${this.student.lastname}\nIdentificación: ${this.student.id_student}`,
      'Confirmar eliminación',
      'Eliminar',
      'Cancelar',
      'danger-alert'
    );
    
    if (!confirmed) return;
    this.loading = true;
    await this.loadingSrv.showLoading('Eliminando estudiante...');
    try {
      const result = await this.querySrv.delete('Student_Cicle', { id: this.student.id_student });
      const coord = await this.preferencesSrv.getPreferences('coordData');
      await this.loadStudents(coord);
      await this.loadInvoices(coord);
      console.log('[DetallesEstudiante] Resultado de eliminación:', result);
      await this.toastSrv.showSuccessToast('Estudiante eliminado correctamente.');
      this.loading = false;
      await this.loadingSrv.dismissLoading();
      this.router.navigate(['/home']);
    } catch (e) {
      await this.toastSrv.showErrorToast('Error al eliminar el estudiante.');
      console.error('[DetallesEstudiante] Error eliminando estudiante', e);
      this.loading = false;
      await this.loadingSrv.dismissLoading();
    }
  }



}
