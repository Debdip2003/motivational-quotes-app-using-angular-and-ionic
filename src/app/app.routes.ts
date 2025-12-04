import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: 'forms',
    loadComponent: () => 
      import('./pages/forms/forms.page').then((m) => m.FormsPage),
  },
  {
    path: 'favourites',
    loadComponent: () =>
      import('./pages/favourites/favourites.page').then(
        (m) => m.FavouritesPage
      ),
    canActivate: [authGuard],
  },
  {
    path: 'form-array',
    loadComponent: () => import('./pages/form-array/form-array.page').then( (m) => m.FormArrayPage),
  },
];
