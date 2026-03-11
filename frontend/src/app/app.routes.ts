import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Category } from './category/category';
import { Order } from './order/order';

export const routes: Routes = [
   /*{
    path: ' ',
    component: HomeComponent
  },*/
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
    path: 'order',
    component: Order
  },

  {
    path: '',
    redirectTo: 'category',
    /*ไม่มีหน้า HomeComponent ให้เลยเริ่มที่อันนี้ navbar */
    pathMatch: 'full'
  }
];