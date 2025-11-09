import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalles-estudiante',
  templateUrl: './detalles-estudiante.page.html',
  styleUrls: ['./detalles-estudiante.page.scss'],
  standalone: false,
})
export class DetallesEstudiantePage implements OnInit {

  // datos de ejemplo (reemplazar con datos reales traidos de un servicio)
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

  constructor() {}

  ngOnInit() {
    // If navigation provided a student in state, use it to populate the view
    const s: any = history.state && (history.state as any).student ? (history.state as any).student : null;
    if (s) {
      this.student = {
        nombre: s.nombre ?? s.Name ?? '',
        apellido: s.apellido ?? s.LastName ?? '',
        correo: s.correo ?? '',
        identificacion: s.identificacion ?? s.ID ?? '',
        direccion: s.direccion ?? '',
        institucion: s.institucion ?? '',
        estado: s.estado ?? '',
        grado: s.grado ?? ''
      };
    }
  }

  public editStudent() {
    // navigation to edit form can be added here
    console.log('Edit student', this.student.identificacion);
  }

  public addPayment() {
    // open payment flow or navigate to payment form
    console.log('Add payment for', this.student.identificacion);
  }

}
