import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à Facturo
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ou
            <a routerLink="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
              créez un compte
            </a>
          </p>
        </div>
        
        @if (sessionExpired()) {
          <div class="rounded-md bg-yellow-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Session expirée</h3>
                <p class="text-sm text-yellow-700 mt-1">Veuillez vous reconnecter pour continuer.</p>
              </div>
            </div>
          </div>
        }
        
        @if (errorMessage()) {
          <div class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Erreur</h3>
                <p class="text-sm text-red-700 mt-1">{{ errorMessage() }}</p>
              </div>
            </div>
          </div>
        }
        
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Adresse email</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required
                     formControlName="email"
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                     placeholder="Adresse email">
            </div>
            <div>
              <label for="password" class="sr-only">Mot de passe</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required
                     formControlName="password"
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                     placeholder="Mot de passe">
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                     class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loading() || loginForm.invalid"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              } @else {
                Se connecter
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  
  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  sessionExpired = signal(false);
  returnUrl = '/';
  
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    // Check if redirected due to expired session
    this.route.queryParams.subscribe(params => {
      this.sessionExpired.set(params['expired'] === 'true');
      this.returnUrl = params['returnUrl'] || '/dashboard';
    });
  }
  
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    this.errorMessage.set('');
    
    const { email, password } = this.loginForm.value;
    
    // Simuler un appel API (à remplacer par vrai appel)
    setTimeout(() => {
      this.loading.set(false);
      
      // MOCK: Simuler une réponse réussie
      // Dans la vraie version, appeler le backend Laravel
      if (email === 'demo@facturo.be' && password === 'password') {
        // Stockage sécurisé du token
        this.authService.setToken('mock_jwt_token_' + Date.now());
        this.authService.setUser({
          id: 1,
          name: 'Demo User',
          email: email
        });
        
        // Redirection vers la page demandée ou dashboard
        this.router.navigate([this.returnUrl]);
      } else {
        this.errorMessage.set('Email ou mot de passe incorrect.');
      }
    }, 1000);
  }
}
