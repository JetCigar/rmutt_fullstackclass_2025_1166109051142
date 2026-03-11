import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Category } from './category/category';
import { Review } from './review/review';
import { CartComponent } from './cart/cart';


export const routes: Routes = [
  {path: '', component: Category},

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'review',
    component: Review
  },

   {
    path: 'cart',
    component: CartComponent
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

