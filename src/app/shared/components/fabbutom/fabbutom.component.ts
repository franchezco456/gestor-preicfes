import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-fabbutom',
  templateUrl: './fabbutom.component.html',
  styleUrls: ['./fabbutom.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class FabbutomComponent {
  /** Emit when user taps Registrar Pago */
  @Output() registerPayment = new EventEmitter<void>();

  /** Emit when user taps Registrar Estudiante */
  @Output() registerStudent = new EventEmitter<void>();

  /** Emit when user taps Logout */
  @Output() logout = new EventEmitter<void>();

  public onRegisterPayment() {
    this.registerPayment.emit();
  }

  public onRegisterStudent() {
    this.registerStudent.emit();
  }

  public async onLogout() {
    this.logout.emit();
  }

}
