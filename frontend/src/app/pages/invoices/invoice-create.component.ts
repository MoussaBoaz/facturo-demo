import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Client {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-invoice-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center">
            <a routerLink="/invoices" class="text-gray-500 hover:text-gray-700 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
            <h1 class="text-2xl font-bold text-gray-900">Nouvelle Facture</h1>
          </div>
          <div class="flex space-x-3">
            <button type="button" (click)="saveAsDraft()" 
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Enregistrer brouillon
            </button>
            <button type="button" (click)="sendInvoice()" 
                    [disabled]="invoiceForm.invalid || loading()"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              @if (loading()) {
                Envoi...
              } @else {
                Créer et envoyer
              }
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form [formGroup]="invoiceForm" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Client -->
            <div class="bg-white rounded-xl shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Client</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                  <select formControlName="client_id" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500">
                    <option value="">Sélectionner un client</option>
                    @for (client of clients(); track client.id) {
                      <option [value]="client.id">{{ client.name }}</option>
                    }
                  </select>
                  @if (invoiceForm.get('client_id')?.invalid && invoiceForm.get('client_id')?.touched) {
                    <p class="text-red-500 text-sm mt-1">Veuillez sélectionner un client</p>
                  }
                </div>
                <div class="flex items-end">
                  <a routerLink="/clients/new" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    + Nouveau client
                  </a>
                </div>
              </div>
            </div>

            <!-- Items -->
            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-900">Articles</h2>
                <button type="button" (click)="addItem()" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  + Ajouter une ligne
                </button>
              </div>
              
              <div class="space-y-4">
                @for (item of items.controls; track $index) {
                  <div class="grid grid-cols-12 gap-4 items-start p-4 bg-gray-50 rounded-lg">
                    <div class="col-span-6">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input type="text" [formControlName]="$index + '.description'" 
                             class="w-full border border-gray-300 rounded-lg px-3 py-2"
                             placeholder="Description du service">
                    </div>
                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Qté</label>
                      <input type="number" [formControlName]="$index + '.quantity'" 
                             class="w-full border border-gray-300 rounded-lg px-3 py-2"
                             (input)="updateItemTotal($index)">
                    </div>
                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Prix HT</label>
                      <input type="number" [formControlName]="$index + '.unit_price'" 
                             class="w-full border border-gray-300 rounded-lg px-3 py-2"
                             (input)="updateItemTotal($index)">
                    </div>
                    <div class="col-span-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Total</label>
                      <p class="py-2 font-medium">€{{ getItemTotal($index) }}</p>
                    </div>
                    <div class="col-span-1 flex items-center justify-end h-full pt-6">
                      @if (items.length > 1) {
                        <button type="button" (click)="removeItem($index)" 
                                class="text-red-500 hover:text-red-700">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Notes -->
            <div class="bg-white rounded-xl shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Notes et conditions</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea formControlName="notes" rows="3" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Notes pour le client..."></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Conditions de paiement</label>
                  <textarea formControlName="terms" rows="2" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Ex: Paiement sous 30 jours"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div class="space-y-6">
            <!-- Dates -->
            <div class="bg-white rounded-xl shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Dates</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date d'émission *</label>
                  <input type="date" formControlName="issue_date" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance *</label>
                  <input type="date" formControlName="due_date" 
                         class="w-full border border-gray-300 rounded-lg px-3 py-2">
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="bg-white rounded-xl shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Total HT</span>
                  <span class="font-medium">€{{ formatPrice(subtotal()) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">TVA</span>
                  <div class="flex items-center">
                    <input type="number" formControlName="tax_rate" 
                           class="w-16 border border-gray-300 rounded px-2 py-1 text-right mr-1"
                           (input)="updateTotals()">
                    <span class="text-gray-600">%</span>
                  </div>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Montant TVA</span>
                  <span class="font-medium">€{{ formatPrice(taxAmount()) }}</span>
                </div>
                <div class="border-t pt-3 flex justify-between">
                  <span class="text-lg font-semibold">Total TTC</span>
                  <span class="text-lg font-bold text-indigo-600">€{{ formatPrice(total()) }}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InvoiceCreateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  invoiceForm: FormGroup;
  loading = signal(false);
  clients = signal<Client[]>([
    { id: 1, name: 'ABC Company', email: 'contact@abc.com' },
    { id: 2, name: 'XYZ Sarl', email: 'info@xyz.com' },
    { id: 3, name: 'John Doe', email: 'john@example.com' }
  ]);
  
  subtotal = signal(0);
  taxAmount = signal(0);
  total = signal(0);

  constructor() {
    this.invoiceForm = this.fb.group({
      client_id: ['', Validators.required],
      issue_date: [this.formatDate(new Date()), Validators.required],
      due_date: [this.formatDate(this.addDays(new Date(), 30)), Validators.required],
      tax_rate: [21],
      notes: [''],
      terms: ['Paiement sous 30 jours'],
      items: this.fb.array([this.createItem()])
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      unit_price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.updateTotals();
    }
  }

  updateItemTotal(index: number) {
    this.updateTotals();
  }

  getItemTotal(index: number): string {
    const item = this.items.at(index);
    const qty = item.get('quantity')?.value || 0;
    const price = item.get('unit_price')?.value || 0;
    return (qty * price).toFixed(2);
  }

  updateTotals() {
    let sub = 0;
    for (let i = 0; i < this.items.length; i++) {
      sub += parseFloat(this.getItemTotal(i));
    }
    const taxRate = this.invoiceForm.get('tax_rate')?.value || 0;
    const tax = sub * (taxRate / 100);
    
    this.subtotal.set(sub);
    this.taxAmount.set(tax);
    this.total.set(sub + tax);
  }

  saveAsDraft() {
    this.loading.set(true);
    console.log('Saving draft:', this.invoiceForm.value);
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/invoices']);
    }, 1000);
  }

  sendInvoice() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    console.log('Sending invoice:', this.invoiceForm.value);
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/invoices']);
    }, 1000);
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
