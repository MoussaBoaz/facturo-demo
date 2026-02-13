import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer votre compte
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ou
            <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              connectez-vous à un compte existant
            </a>
          </p>
        </div>
        
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
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="name" class="sr-only">Nom complet</label>
              <input id="name" name="name" type="text" formControlName="name" required
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                     placeholder="Nom complet">
            </div>
            <div>
              <label for="email" class="sr-only">Adresse email</label>
              <input id="email" name="email" type="email" formControlName="email" required
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                     placeholder="Adresse email">
            </div>
            <div>
              <label for="password" class="sr-only">Mot de passe</label>
              <input id="password" name="password" type="password" formControlName="password" required
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                     placeholder="Mot de passe (min 8 caractères)">
            </div>
            <div>
              <label for="password_confirmation" class="sr-only">Confirmer le mot de passe</label>
              <input id="password_confirmation" name="password_confirmation" type="password" 
                     formControlName="password_confirmation" required
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                     placeholder="Confirmer le mot de passe">
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="registerForm.invalid || loading()"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              } @else {
                Créer le compte
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService: AuthService = inject(AuthService);
  
  registerForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    this.errorMessage.set('');
    
    const { name, email, password, password_confirmation } = this.registerForm.value;
    
    // VRAI APPEL API AU BACKEND LARAVEL
    this.authService.register(name, email, password, password_confirmation).subscribe({
      next: (response) => {
        this.loading.set(false);
        // Redirection vers dashboard après inscription
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Register error:', err);
        
        if (err.status === 422) {
          // Erreurs de validation
          if (err.error?.errors?.email) {
            this.errorMessage.set('Cet email est déjà utilisé.');
          } else if (err.error?.errors?.password) {
            this.errorMessage.set('Le mot de passe doit faire au moins 8 caractères.');
          } else {
            this.errorMessage.set('Données invalides. Vérifiez vos informations.');
          }
        } else if (err.status === 0) {
          this.errorMessage.set('Impossible de contacter le serveur. Vérifiez votre connexion.');
        } else {
          this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        }
      }
    });
  }
}
