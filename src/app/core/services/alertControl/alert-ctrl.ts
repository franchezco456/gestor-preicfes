import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertCtrl {

  constructor(private alertCtrl: AlertController) { }

  async confirm(
    message: string,
    header: string = 'Confirmar',
    confirmText: string = 'Aceptar',
    cancelText: string = 'Cancelar',
    cssClass: string = 'custom-alert'
  ): Promise<boolean> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [

        {
          text: confirmText,
          role: 'confirm',
        },
        {
          text: cancelText,
          role: 'cancel',
        },
        

      ],
      cssClass
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }

  async showAlert(
    message: string,
    header: string = 'Alerta',
    buttonText: string = 'OK',
    cssClass: string = 'custom-alert'
  ): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [{ text: buttonText, role: 'ok' }],
      cssClass
    });
    await alert.present();
    await alert.onDidDismiss();
  }
}
