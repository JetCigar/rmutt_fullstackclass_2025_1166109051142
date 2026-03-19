import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Category } from './category/category';
import { HomeComponent } from './home/home';
import { ContactComponent } from './contact/contact';
import { AboutComponent } from './about/about';
import { Order } from './order/order';
import { Shipping } from './shipping/shipping';
import { Address } from './address/address';
import { SettingPage } from './setting-page/setting-page';
import { Review } from './review/review';
import { CartComponent } from './cart/cart';
import { ProductInfo } from './product-info/product-info';

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
  { path: 'contact', component: ContactComponent },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'order',
    component: Order
  },
  {
    path: 'shipping',
    component: Shipping
  },
  {
    path: 'address',
    component: Address
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
    path: 'settings',
    component: SettingPage
  },
  {
    path: 'product-info/:id',
    component: ProductInfo // 2.
  },
];
