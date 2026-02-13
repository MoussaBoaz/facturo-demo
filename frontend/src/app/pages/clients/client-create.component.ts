import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <a routerLink="/clients" class="text-gray-500 hover:text-gray-700 mr-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
              </a>
              <h1 class="text-2xl font-bold text-gray-900">Nouveau Client</h1>
            </div>
            <div class="flex space-x-3">
              <button type="button" (click)="cancel()" 
                      class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button type="button" (click)="save()" 
                      [disabled]="clientForm.invalid || loading()"
                      class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                @if (loading()) {
                  <span>Enregistrement...</span>
                } @else {
                  <span>Enregistrer</span>
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form [formGroup]="clientForm" class="max-w-2xl">
          @if (errorMessage()) {
            <div class="rounded-md bg-red-50 p-4 mb-6">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Erreur</h3>
                  <p class="text-sm text-red-700 mt-1">{{ errorMessage() }}</p>
                </div>
              </div>
            </div>
          }

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <!-- Nom -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Nom complet <span class="text-red-500">*</span>
              </label>
              <input type="text" id="name" formControlName="name"
                     class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="Nom du client">
              @if (clientForm.get('name')?.invalid && clientForm.get('name')?.touched) {
                <p class="mt-1 text-sm text-red-600">Le nom est requis</p>
              }
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email <span class="text-red-500">*</span>
              </label>
              <input type="email" id="email" formControlName="email"
                     class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="client@example.com">
              @if (clientForm.get('email')?.invalid && clientForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-600">Email valide requis</p>
              }
            </div>

            <!-- Entreprise -->
            <div>
              <label for="company" class="block text-sm font-medium text-gray-700 mb-1">
                Entreprise <span class="text-red-500">*</span>
              </label>
              <input type="text" id="company" formControlName="company"
                     class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="Nom de l'entreprise">
              @if (clientForm.get('company')?.invalid && clientForm.get('company')?.touched) {
                <p class="mt-1 text-sm text-red-600">L'entreprise est requise</p>
              }
            </div>

            <!-- Téléphone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Téléphone <span class="text-red-500">*</span>
              </label>
              <input type="tel" id="phone" formControlName="phone"
                     class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="+32 123 456 789">
              @if (clientForm.get('phone')?.invalid && clientForm.get('phone')?.touched) {
                <p class="mt-1 text-sm text-red-600">Le téléphone est requis</p>
              }
            </div>

            <!-- Adresse -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <textarea id="address" formControlName="address" rows="3"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Adresse complète"></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ClientCreateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientService: ClientService = inject(ClientService);
  
  clientForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  
  constructor() {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      address: ['']
    });
  }
  
  save() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.clientService.createClient(this.clientForm.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Create client error:', err);
        
        if (err.status === 422) {
          this.errorMessage.set('Données invalides. Vérifiez les champs.');
        } else if (err.status === 0) {
          this.errorMessage.set('Impossible de contacter le serveur.');
        } else {
          this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        }
      }
    });
  }
  
  cancel() {
    this.router.navigate(['/clients']);
  }
}
