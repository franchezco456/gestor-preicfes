import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from 'src/app/core/services/query/query';
import { Loading } from 'src/app/core/services/loading/loading';

@Component({
  selector: 'app-detalles-estudiante',
  templateUrl: './detalles-estudiante.page.html',
  styleUrls: ['./detalles-estudiante.page.scss'],
  standalone: false,
})
export class DetallesEstudiantePage implements OnInit {
  public student = {
    nombre: 'Jesus',
    apellido: 'Ramos',
    correo: 'jesus.ramos@unicolombo.com',
    identificacion: '1142912485',
    direccion: 'Calle 123',
    institucion: 'IE San Nicolas',
    estado: 'Activo',
    grado: '11'
  };
  
  public paymentSummary = {
    courseValue: 200000,
    totalPaid: 80000,
    discount: 0,
    pending: 120000
  };

  public loading = false;
  public notFound = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly querySrv: Query,
    private readonly loadingSrv: Loading,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('[DetallesEstudiante] Param id =', id);
    if (!id) { this.notFound = true; return; }
    this.loading = true;
    await this.loadingSrv.showLoading('Cargando estudiante...');
    try {
      const rows: any[] = await this.querySrv.execute_Function('get_students_by_ie_cicle', {p_id_student : id});
      const s = Array.isArray(rows) ? rows[0] : null;
      if (!s) { this.notFound = true; return; }
      this.student = {
        nombre: s.nombre_out ?? '',
        apellido: s.apellido_out ?? '',
        correo: s.email_out ?? '',
        identificacion: s.invoice_id_out ?? id,
        direccion: s.direccion_out ?? '',
        institucion: '',
        estado: '',
        grado: s.grado_out ?? ''
      };
      console.log('[DetallesEstudiante] Estudiante cargado:', this.student);
      await this.loadEnrollment(this.student.identificacion);
    } catch (e) {
      console.error('[DetallesEstudiante] Error cargando estudiante', e);
      this.notFound = true;
    } finally {
      this.loading = false;
      await this.loadingSrv.dismissLoading();
    }
  }

  private async loadEnrollment(studentId: string) {
    try {

      const invoiceData = await this.querySrv.execute_Function('get_invoices', { id_student: studentId });
      if(!invoiceData || invoiceData.length === 0) {
        return ;
      }
      const invoice = invoiceData[0];
      if(!invoice.status) {
        this.student.estado = 'Pendiente'
      }else{
        this.student.estado = 'Pagado';
      }
      this.student.institucion = invoice.ie_name;
      this.paymentSummary.courseValue = invoice.total_value ;
      this.paymentSummary.totalPaid = invoice.paid_amount;
      this.paymentSummary.pending = invoice.remaining_debt;
      this.paymentSummary.discount = invoice.discount;
    } catch (e) {
      console.warn('[DetallesEstudiante] No se pudo cargar inscripcion', e);
    }
  }


  // Maneja las acciones del fab flotante
  public onFabAction(action: any) {
    const id = typeof action === 'string' ? action : (action?.id ?? '');
    switch (id) {
      case 'editar':
        this.router.navigate(['/actualizar-estudiante', this.student.identificacion]);
        break;
      case 'eliminar':
        this.router.navigate(['/eliminar-estudiante', this.student.identificacion]);
        break;
      case 'pago':
        this.router.navigate(['/form-pagos', this.student.identificacion]);
        break;
      case 'volver':
        this.router.navigate(['/home']);
        break;
      default:
        break;
    }
  }

  public goToEdit() {
    this.router.navigate(['/actualizar-estudiante', this.student.identificacion]);
  }
}
