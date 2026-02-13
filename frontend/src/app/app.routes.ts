import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InvoiceListComponent } from './pages/invoices/invoice-list.component';
import { InvoiceCreateComponent } from './pages/invoices/invoice-create.component';
import { ClientListComponent } from './pages/clients/client-list.component';
import { authGuard, publicGuard } from './core/services/auth.service';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [publicGuard] },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'invoices', 
    component: InvoiceListComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'invoices/new', 
    component: InvoiceCreateComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'clients', 
    component: ClientListComponent, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' }
];
