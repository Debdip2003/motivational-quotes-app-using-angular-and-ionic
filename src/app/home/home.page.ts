import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../services/data-service/data';
import { AuthService } from '../services/auth-service/auth-service';
import { ToastService } from '../services/toast-service/toast';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  //dependency injections
  private dataService = inject(DataService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  //initializing values
  email: string | null = null;
  favouriteQuote: { quoteId?: number; quote: string; author: string }[] | null =
    [];
  quotes: { id?: number; quote: string; author: string }[] = [];
  currentPage = 1;
  quotesPerPage = 10;
  loading = false;

  ngOnInit() {
    this.authService.email$.subscribe((email) => {
      if (email) {
        this.email = email;
        this.loadFavourites();
      }
    });
    this.fetchQuotes();
  }

  //fetch quote function
  fetchQuotes() {
    this.loading = true;
    this.dataService.getQuote().subscribe({
      next: (data) => {
        this.quotes = this.shuffledArray(data.quotes);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading quotes:', err);
        this.loading = false;
      },
    });
  }

  //get shuffled data everytime the page is reload
  shuffledArray(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const j = Math.floor(Math.random() * i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  //get total number of pages dynamically
  get totalNumberOfPages() {
    return Math.ceil(this.quotes.length / this.quotesPerPage);
  }

  //get paginated data
  get paginatedQuote() {
    const start = (this.currentPage - 1) * this.quotesPerPage;
    const end = start + this.quotesPerPage;
    return this.quotes.slice(start, end);
  }

  //function to change the page number
  changePage(page: number) {
    if (page >= 1 && page <= this.totalNumberOfPages) {
      this.currentPage = page;
    }
  }

  // Load all favourites for the logged-in user
  loadFavourites() {
    if (!this.email) return;

    this.dataService.getFavourites(this.email).subscribe({
      next: (favs) => {
        this.favouriteQuote = favs;
      },
      error: (error) => {
        console.log('Error loading favourite quotes', error);
        this.toast.error('Please try again later');
      },
    });
  }

  //  Add to favourites using JSON Server
  addToFavourite(quotes: any) {
    if (!this.email) {
      this.router.navigate(['/forms']);
      return;
    }

    this.dataService.getFavourites(this.email).subscribe((favs) => {
      const alreadyExists = favs.find((f) => f.quoteId === quotes.id);

      if (!alreadyExists) {
        const favData = {
          quoteId: quotes.id,
          userEmail: this.email,
          quote: quotes.quote,
          author: quotes.author,
        };

        this.dataService.addFavourite(favData).subscribe({
          next: () => {
            this.toast.success('Added to favourites');
            this.loadFavourites();
          },
          error: () => this.toast.error('Please try again later'),
        });
      } else {
        this.toast.error('Please add quote first to delete');
      }
    });
  }

  isFavourite(quoteId: number | undefined): boolean {
    if (!this.favouriteQuote) return false;
    return this.favouriteQuote.some((f) => f.quoteId === quoteId);
  }

  //on clicking the log out button
  onLogOut() {
    this.authService.logout();
    this.favouriteQuote = [];
    this.toast.success('Logout succesfully');
  }
}
