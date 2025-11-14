import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from 'src/app/services/data-service/data';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonItemSliding,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-service/auth-service';
import { ToastService } from 'src/app/services/toast-service/toast';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  imports: [
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonLabel,
    IonItem,
    IonItemSliding,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    RouterLink,
  ],
})
export class FavouritesPage implements OnInit, AfterViewInit {
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  email: string | null = null;
  favouriteQuote: { id?: number; quote: string; author: string }[] = [];

  ngOnInit(): void {
    this.authService.email$.subscribe((email) => (this.email = email));
  }

  ngAfterViewInit(): void {
    //load all the quotes after the view is changed to favourite page
    if (this.email) {
      this.loadFavourites();
    }
  }

  //  Load all favourites for the logged-in user
  loadFavourites() {
    if (!this.email) return;

    this.dataService.getFavourites(this.email).subscribe((favs) => {
      this.favouriteQuote = favs;
    });
  }

  //  Delete a favourite quote
  onDeleteFavourite(q: { id?: number }) {
    if (!q.id) return;
    this.dataService.deleteFavourite(q.id.toString()).subscribe({
      next: () => {
        this.toast.success('Deleted successfully');
        this.loadFavourites();
      },
      error: () => this.toast.error('Please try again later'),
    });
  }
}
