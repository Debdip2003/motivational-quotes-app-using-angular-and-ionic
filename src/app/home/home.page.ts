import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../services/data-service/data';
import { AuthService } from '../services/auth-service/auth-service';
import { ToastService } from '../services/toast-service/toast';
import { Share } from '@capacitor/share';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, RouterLink],
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

  quotes: { id?: number; quote: string; author: string }[] = [];
  dailyQuote: {
    id?: number;
    quote: string;
    author: string;
  } | null = null;
  currentPage = 1;
  quotesPerPage = 10;
  loading = false;

  //ngOnInit functions
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
        // this.quotes = this.shuffledArray(data.quotes);
        console.log(data.quotes);
        this.quotes = data.quotes;
        this.loading = false;
        this.getDailyQuote();
      },
      error: (err) => {
        console.error('Error loading quotes:', err);
        this.loading = false;
      },
    });
  }

  getDailyQuote() {
    //initialize the daily data
    let dailyData: any = null;
    // Ensure quotes are loaded
    if (!this.quotes || this.quotes.length === 0) {
      console.warn('Quotes not loaded yet');
      return;
    }

    // const today = new Date().toISOString().split('T')[0];
    const today = new Date().toLocaleDateString('en-CA');
    const saved = localStorage.getItem('dailyQuote');
    console.log(saved);

    // If saved and matches today then return existing quote
    if (saved) {
      dailyData = JSON.parse(saved);
    }
    if (dailyData && dailyData.date === today && dailyData.quote) {
      this.dailyQuote = dailyData.quote;
      console.log(dailyData.quote);
      return;
    }

    // Generate new daily quote
    const randomQuote =
      this.quotes[Math.floor(Math.random() * this.quotes.length)];
    this.dailyQuote = randomQuote;

    // Save to localStorage
    localStorage.setItem(
      'dailyQuote',
      JSON.stringify({
        date: today,
        quote: randomQuote,
      })
    );
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
  totalNumberOfPages() {
    return Math.ceil(this.quotes.length / this.quotesPerPage);
  }

  //get paginated data
  paginatedQuote() {
    const start = (this.currentPage - 1) * this.quotesPerPage;
    const end = start + this.quotesPerPage;
    return this.quotes.slice(start, end);
  }

  //function to change the page number
  changePage(page: number) {
    if (page >= 1 && page <= this.totalNumberOfPages()) {
      this.currentPage = page;
    }
  }

  // Load all favourites for the logged-in user
  loadFavourites() {
    if (this.email) {
      this.dataService.getFavourites(this.email).subscribe({
        next: (favs) => {
          this.authService.favouriteQuoteSubject.next(favs);
        },
        error: (error) => {
          console.log('Error loading favourite quotes', error);
          this.toast.error('Please try again later');
        },
      });
    }
    // if (!this.email) return;
  }

  //  Add to favourites using JSON Server
  addToFavourite(quotes: { id?: number; quote: string; author: string }) {
    if (!this.email) {
      this.router.navigate(['/forms']);
      return;
    }

    this.dataService.getFavourites(this.email).subscribe((favs) => {
      const alreadyExists = favs.find((f) => f.quoteId === quotes.id);

      if (!alreadyExists) {
        // const favData = {
        //   quoteId: quotes.id,
        //   userEmail: this.email,
        //   quote: quotes.quote,
        //   author: quotes.author,
        //   isFav: true,
        // };

        const favData = {
          quoteId: quotes.id,
          userEmail: this.email,
          quote: quotes.quote,
          author: quotes.author,
          isFav: true,
        };
        console.log(favData);

        this.dataService.addFavourite(favData).subscribe({
          next: () => {
            this.toast.success('Added to favourites');
            this.loadFavourites();
          },
          error: () => this.toast.error('Please try again later'),
        });
      } else {
        this.toast.warning('This quote already exists in your favourites');
      }
    });
  }

  isFavourite(quoteId: number | undefined): boolean {
    if (!this.authService.favouriteQuoteSubject.value) return false;
    return this.authService.favouriteQuoteSubject.value.some(
      (f) => f.quoteId === quoteId
    );
  }

  //on clicking the log out button
  onLogOut() {
    this.authService.logout();
    this.authService.favouriteQuoteSubject.next([]);
    this.toast.success('Logout succesfully');
  }

  //share functionality
  async shareQuote(index?: number) {
    if (index) {
      await Share.share({
        dialogTitle: 'Here is the motivational quote for you',
        text: this.quotes[index].quote,
      });
    }
  }
}
