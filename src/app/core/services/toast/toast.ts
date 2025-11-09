import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class Toast {
    constructor(private toastController: ToastController) { }

    async showToast(
        message: string,
        duration: number = 2000,
        color: string = 'primary'
    ): Promise<void> {
        const toast = await this.toastController.create({
            message,
            duration,
            color,
            position: 'bottom'
        });
        await toast.present();
    }


    async showErrorToast(
        message: string,
        duration: number = 3000
    ): Promise<void> {
        await this.showToast(message, duration, 'danger');
    }

    async showSuccessToast(
        message: string,
        duration: number = 2000
    ): Promise<void> {
        await this.showToast(message, duration, 'success');
    }


    async showWarningToast(
        message: string,
        duration: number = 2500
    ): Promise<void> {
        await this.showToast(message, duration, 'warning');
    }
}
