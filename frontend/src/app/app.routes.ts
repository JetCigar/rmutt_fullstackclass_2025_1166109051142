import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Category } from './category/category';
import { HomeComponent } from './home/home';
import { ContactComponent } from './contact/contact';
import { AboutComponent } from './about/about';
import { Review } from './review/review';
import { CartComponent } from './cart/cart';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
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
  { path: 'contact', component: ContactComponent }
  ,
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'review',
    component: Review
  },

   {
    path: 'cart',
    component: CartComponent
  }
];
