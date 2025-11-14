import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.JSON_SERVER_API_BASE_URL;
  private publicApiUrl = environment.PUBLIC_API_BASE_URL;

  constructor(private http: HttpClient) {}

  //get quote functionality from public api
  getQuote(): Observable<{ quotes: { quote: string; author: string }[] }> {
    return this.http.get<{ quotes: { quote: string; author: string }[] }>(
      `${this.publicApiUrl}/quotes`
    );
  }

  //users login signup functionality

  getUserByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }

  // favourite quote
  getFavourites(userEmail: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favourites`, {
      params: {
        userEmail: userEmail,
      },
    });
  }

  addFavourite(fav: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/favourites`, fav);
  }

  // deleteFavourite(favQuote: string | null): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/favourites/${favQuote}`);
  // }

  deleteFavourite(quoteId: string | null): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favourites/${quoteId}`);
  }
}
