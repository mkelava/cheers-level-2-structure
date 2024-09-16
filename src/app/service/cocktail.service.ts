import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cocktail } from '../model/cocktail.model';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {

  private apiUrl: string = '/cocktails';

  constructor(private http: HttpClient) {}

  getCocktails(): Observable<Cocktail[]> {
    return this.http.get<Cocktail[]>(this.apiUrl);
  }
}
