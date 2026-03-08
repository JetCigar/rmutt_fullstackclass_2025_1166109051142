import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Category } from './category/category';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'category',
    component: Category
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];