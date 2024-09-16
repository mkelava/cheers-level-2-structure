import { Routes } from '@angular/router';
import { CocktailListComponent } from './pages/cocktail-list/cocktail-list.component';
import { CocktailDetailsComponent } from './pages/cocktail-details/cocktail-details.component';

export const routes: Routes = [
  {
    path: '',
    component: CocktailListComponent
  },
  {
    path: 'cocktails/:cocktailId',
    component: CocktailDetailsComponent
  }
];
