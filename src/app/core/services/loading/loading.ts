import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class Loading {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

 
  async showLoading(message: string = 'Cargando...'): Promise<void> {
    this.loading = await this.loadingController.create({
      message,
      backdropDismiss: false,
      spinner: 'circles'
    });

    await this.loading.present();
  }


  async dismissLoading(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
