import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private emailSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('email')
  );
  email$ = this.emailSubject.asObservable();
  favouriteQuoteSubject = new BehaviorSubject<
    { quoteId?: number; quote: string; author: string; isFav: boolean }[]
  >([]);
  favourite$ = this.favouriteQuoteSubject.asObservable();

  login(email: string) {
    localStorage.setItem('email', email);
    this.emailSubject.next(email); //update the mail if there is any changes to the mail
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('email') ? true : false;
  }

  logout() {
    localStorage.removeItem('email');
    this.emailSubject.next(null);
  }
}
