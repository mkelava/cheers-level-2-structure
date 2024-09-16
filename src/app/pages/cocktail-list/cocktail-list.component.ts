import { Component, OnInit } from '@angular/core';
import { Cocktail } from '../../model/cocktail.model';
import { CocktailService } from '../../service/cocktail.service';
import { NgForOf } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzRowDirective } from 'ng-zorro-antd/grid';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cocktail-list',
  standalone: true,
  imports: [
    NgForOf,
    NzTagModule,
    NzRowDirective,
    NzIconDirective
  ],
  templateUrl: './cocktail-list.component.html',
  styleUrl: './cocktail-list.component.scss'
})
export class CocktailListComponent implements OnInit {
  cocktailList: Cocktail[] = [];
  filteredCocktailList: Cocktail[] = [];
  favoriteCocktailList: Cocktail[] = [];

  constructor(private cocktailService: CocktailService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getCocktailList();
    this.loadFavoriteCocktailList();
  }

  getCocktailList(): void {
    this.cocktailService.getCocktails().subscribe((data: Cocktail[]) => {
      this.cocktailList = data;
      this.filteredCocktailList = data;
    });
  }

  onSearch(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.applySearch(input.value);
  }

  applySearch(searchValue: string): void {
    const search = searchValue.trim().toLowerCase();
    this.filteredCocktailList = this.cocktailList.filter((cocktail: Cocktail) =>
      cocktail.name.toLowerCase().includes(search)
    );
  }

  loadFavoriteCocktailList(): void {
    const savedFavorites = localStorage.getItem('favoriteCocktails');
    if (savedFavorites) {
      this.favoriteCocktailList = JSON.parse(savedFavorites);
    }
  }

  saveFavorites(): void {
    localStorage.setItem('favoriteCocktails', JSON.stringify(this.favoriteCocktailList));
  }

  toggleFavorite(cocktail: Cocktail): void {
    const isFavorite = this.isFavorite(cocktail);
    if (isFavorite) {
      this.favoriteCocktailList = this.favoriteCocktailList.filter(fav => fav.name !== cocktail.name);
    } else {
      this.favoriteCocktailList.push(cocktail);
    }
    this.saveFavorites();
  }

  isFavorite(cocktail: Cocktail): boolean {
    return this.favoriteCocktailList.some(fav => fav.name === cocktail.name);
  }

  navigateToDetails(cocktailId: string): void {
    this.router.navigate(['/cocktails', cocktailId]);
  }
}
