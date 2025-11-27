import { Injectable } from '@angular/core';
import { Query } from '../query/query';
import { BehaviorSubject } from 'rxjs';
import { Invoices, Student } from 'src/domain/models/index';

@Injectable({
  providedIn: 'root'
})
export class Data {

  private _students = new BehaviorSubject<Student[]>([]);
  private _payments = new BehaviorSubject<any[]>([]);
  private _institutions = new BehaviorSubject<any[]>([]);
  private _invoices = new BehaviorSubject<Invoices[]>([]);
  private _coordinator = new BehaviorSubject<any>(null);

  public students$ = this._students.asObservable();
  public payments$ = this._payments.asObservable();
  public institutions$ = this._institutions.asObservable();
  public invoices$ = this._invoices.asObservable();
  public coordinator$ = this._coordinator.asObservable();
  constructor(
    private readonly querySrv: Query
  ) { }

  public get currentStudents(): any[] {
    return this._students.value;
  }

  public get currentPayments(): any[] {
    return this._payments.value;
  }

  public get currentInstitutions(): any[] {
    return this._institutions.value;
  }

  public get currentInvoices(): any[] {
    return this._invoices.value;
  }

  public get currentCoordinator(): any {
    return this._coordinator.value;
  }

  public setCoordinator(data: any) {
    this._coordinator.next(data);
  }

  public async loadStudents(id_IE?: string | null) {
    try {
      const rows: any[] = await this.querySrv.execute_Function('get_students_by_ie_cicle', { p_id_ie_cicle: id_IE });

      const mappedStudents = (rows || []).map(s => ({
        id_student: s.invoice_id_out ?? '',
        no_document: s.id_estudiante_out ?? '',
        document_type: s.documento_tipo_out ?? 'TI',
        name: s.nombre_out ?? '',
        lastname: s.apellido_out ?? '',
        email: s.email_out ?? '',
        address: s.direccion_out ?? '',
        phone: s.telefono_out ?? '',
        id_IE: s.id_ie_cicle_out ?? '',
        grado: s.grado_out ?? ''
      }));

      this._students.next(mappedStudents);

    } catch (error) {
      console.error('[ERROR] Fallo carga de estudiantes', error);
      this._students.next([]);
    }
  }

  public async loadPayments(id_IE?: string | null, id_Student?: string | null, id_payment?: string | null) {
    try {
      const rows: any[] = await this.querySrv.execute_Function('get_payments', { id_ie: id_IE, id_student: id_Student, id_payment: id_payment });

      const mappedPayments = (rows || []).map(r => ({
        payment_id: r.payment_id,
        payment_value: r.payment_value,
        payment_date: r.payment_date,
        invoice_id: r.invoice_id,
        student_id: r.student_id,
        ie_dane: r.ie_dane,
        course_value: r.course_value,
        remaining_debt: r.remaining_debt
      }));

      this._payments.next(mappedPayments);
    } catch (error) {
      console.error('[ERROR] Fallo carga de pagos', error);
      this._payments.next([]);
    }
  }

  public async loadInstitutions(id_IE_Cicle?: string | null) {
    try {
      const rows: any[] = await this.querySrv.execute_Function('get_ie', { filter_id: id_IE_Cicle });

      const mappedInstitutions = (rows || []).map(i => ({
        dane: i.dane_out,
        name: i.name_out,
        address: i.address_out,
        email: i.email_out,
        phone: i.phone_out,
        id_cicle: i.id_cicle_out,
        id_ie_cicle: i.id_ie_cicle_out,
        discount: i.discount_out,
        free_prices: i.free_prices_out
      }));

      this._institutions.next(mappedInstitutions);
    } catch (error) {
      console.error('[ERROR] Fallo carga de instituciones', error);
      this._institutions.next([]);
    }
  }

  public async loadInvoices(id_IE?: string | null, id_Student?: string | null) {
    try {
      const rows: any[] = await this.querySrv.execute_Function('get_invoices', { id_ie: id_IE, id_student: id_Student });

      const mappedInvoices = (rows || []).map(i => ({
        invoice_id: i.invoice_id,
        creation_date: i.creation_date,
        status: i.status,
        total_value: i.total_value,
        discount: i.discount,
        paid_amount: i.paid_amount,
        installments: i.installments,
        remaining_debt: i.remaining_debt,
        student_id: i.student_id,
        ie_id: i.ie_id
      }));

      this._invoices.next(mappedInvoices);
    } catch (error) {
      console.error('[ERROR] Fallo carga de facturas', error);
      this._invoices.next([]);
    }
  }
}
