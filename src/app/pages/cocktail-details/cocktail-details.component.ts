import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Cocktail } from '../../model/cocktail.model';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { AsyncPipe, NgIf } from '@angular/common';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-cocktail-details',
  standalone: true,
  imports: [
    NzTagComponent,
    AsyncPipe,
    NgIf,
    NzRowDirective,
    NzColDirective,
    NzIconDirective
  ],
  templateUrl: './cocktail-details.component.html',
  styleUrl: './cocktail-details.component.scss'
})
export class CocktailDetailsComponent implements OnInit {
  cocktail$: Observable<Cocktail>;
  cocktailId: string | null;
  favoriteCocktails: Cocktail[] = [];
  isFavorite$ = new BehaviorSubject<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
    this.cocktail$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.cocktailId = params.get('cocktailId');
        return this.http.get<Cocktail>(`/cocktails/${this.cocktailId}`);
      })
    );
    this.cocktail$.subscribe(cocktail => {
      this.updateFavoriteStatus(cocktail);
    });
  }

  loadFavorites(): void {
    const savedFavorites = localStorage.getItem('favoriteCocktails');
    if (savedFavorites) {
      this.favoriteCocktails = JSON.parse(savedFavorites);
    }
  }

  saveFavorites(): void {
    localStorage.setItem('favoriteCocktails', JSON.stringify(this.favoriteCocktails));
  }

  toggleFavorite(cocktail: Cocktail): void {
    const index = this.favoriteCocktails.findIndex(fav => fav.id === cocktail.id);
    if (index > -1) {
      this.favoriteCocktails.splice(index, 1);
    } else {
      this.favoriteCocktails.push(cocktail);
    }
    this.saveFavorites();
    this.updateFavoriteStatus(cocktail);
  }

  updateFavoriteStatus(cocktail: Cocktail): void {
    const isFav = this.favoriteCocktails.some(fav => fav.id === cocktail.id);
    this.isFavorite$.next(isFav);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
