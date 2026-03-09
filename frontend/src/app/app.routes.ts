import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Category } from './category/category';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
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
    redirectTo: 'navbar',
    /*ไม่มีหน้า HomeComponent ให้เลยเริ่มที่อันนี้ navbar */
    pathMatch: 'full'
  }
];