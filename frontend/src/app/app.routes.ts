import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { ActifListComponent } from './components/actif-list/actif-list';
import { ActifDetailComponent } from './components/actif-detail/actif-detail'; 
import { authGuard } from './guard/auth';
import { AProposComponent } from './pages/a-propos/a-propos';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'actifs', component: ActifListComponent, canActivate: [authGuard] },
  { path: 'actifs/:id', component: ActifDetailComponent, canActivate: [authGuard] }, 
  { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'a-propos', component: AProposComponent }
];