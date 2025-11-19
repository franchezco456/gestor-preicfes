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
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@example.com',
    identificacion: '1042576911',
    direccion: 'Calle 123 #45-67',
    institucion: 'IE San Patricio',
    estado: 'Activo',
    grado: '11'
  };
  public paymentSummary = {
    courseValue: 200000,
    totalPaid: 80000,
    discount: 0,
    pending: 120000,
    totalPreicfes: 120000
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
      const rows: any[] = await this.querySrv.getOne('Student', { id });
      const s = Array.isArray(rows) ? rows[0] : null;
      if (!s) { this.notFound = true; return; }
      this.student = {
        nombre: s.Name ?? '',
        apellido: s.LastName ?? '',
        correo: s.Email ?? '',
        identificacion: s.id ?? id,
        direccion: s.Address ?? '',
        institucion: '',
        estado: '',
        grado: ''
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
      const scRows: any[] = await this.querySrv.getOne('Student_Cicle', { id_Student: studentId }).catch(() => []);
      if (!Array.isArray(scRows) || scRows.length === 0) return;
      const sc = scRows[0];
      if (sc?.id_IE_Cicle) {
        const iecRows: any[] = await this.querySrv.getOne('IE_Cicle', { id: sc.id_IE_Cicle }).catch(() => []);
        const iec = Array.isArray(iecRows) ? iecRows[0] : null;
        if (iec?.id_IE) {
          const ieRows: any[] = await this.querySrv.getOne('IE', { DANE: iec.id_IE }).catch(() => []);
          const ie = Array.isArray(ieRows) ? ieRows[0] : null;
          if (ie) this.student.institucion = ie.Name || '';
        }
      }
      this.student.grado = sc?.Grade || this.student.grado;
      this.student.estado = sc?.Status || this.student.estado;
      console.log('[DetallesEstudiante] Enrollment cargado:', { grado: this.student.grado, estado: this.student.estado, institucion: this.student.institucion });
    } catch (e) {
      console.warn('[DetallesEstudiante] No se pudo cargar inscripción', e);
    }
  }

}
