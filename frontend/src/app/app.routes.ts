import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Category } from './category/category';
import { Review } from './review/review';
import { CartComponent } from './cart/cart';
import { CheckoutAddress } from './checkout/checkout-address/checkout-address';
import { CheckoutPayment } from './checkout/checkout-payment/checkout-payment';
import { CheckoutConfirm } from './checkout/checkout-confirm/checkout-confirm';
import { CheckoutSuccess } from './checkout/checkout-success/checkout-success';

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
    path: 'checkout/address',
    component: CheckoutAddress
  },
  {
    path: 'checkout/payment',
    component: CheckoutPayment
  },
  {
    path: 'checkout/confirm',
    component: CheckoutConfirm
  },
  {
    path: 'checkout/success',
    component: CheckoutSuccess
  },
  

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

