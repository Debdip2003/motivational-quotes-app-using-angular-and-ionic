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

  login(email: string) {
    localStorage.setItem('email', email);
    this.emailSubject.next(email);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('email') ? true : false;
  }

  logout() {
    localStorage.removeItem('email');
    this.emailSubject.next(null);
  }
}
