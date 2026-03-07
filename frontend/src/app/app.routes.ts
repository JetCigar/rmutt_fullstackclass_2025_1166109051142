import { Routes } from '@angular/router';
<<<<<<< HEAD
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';

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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
=======
import { Category } from './category/category';

export const routes: Routes = [
    {path: '', component: Category},
];
>>>>>>> 140fe010314751975635b9e84e0e3e29c7bae605
