import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  // Generic toast
  async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning',
    duration: number = 3000
  ) {
    if (!message) return;

    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'bottom',
      buttons: [
        {
          text: '✖',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }

  // Shorthand methods
  success(message: string) {
    this.showToast(message, 'success');
  }

  error(message: string) {
    this.showToast(message, 'danger');
  }

  warning(message: string) {
    this.showToast(message, 'warning');
  }
}
