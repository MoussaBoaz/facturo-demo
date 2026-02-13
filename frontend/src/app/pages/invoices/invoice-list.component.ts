import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Invoice {
  id: number;
  invoice_number: string;
  client_name: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
}

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div class="flex items-center px-6 h-16 border-b border-gray-200">
          <span class="text-xl font-bold text-indigo-600">Facturo</span>
        </div>
        <nav class="p-4 space-y-1">
          <a routerLink="/dashboard" 
             routerLinkActive="bg-indigo-50 text-indigo-600"
             [routerLinkActiveOptions]="{ exact: true }"
             class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            Dashboard
          </a>
          <a routerLink="/invoices" 
             routerLinkActive="bg-indigo-50 text-indigo-600"
             class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Factures
          </a>
          <a routerLink="/clients" 
             routerLinkActive="bg-indigo-50 text-indigo-600"
             class="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Clients
          </a>
          <button (click)="logout()" 
                  class="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Déconnexion
          </button>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="ml-64 p-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Factures</h1>
            <p class="mt-1 text-sm text-gray-500">Gérez vos factures</p>
          </div>
          <a routerLink="/invoices/new" 
             class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nouvelle facture
          </a>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <input type="text" 
                     placeholder="Rechercher une facture..."
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyée</option>
              <option value="paid">Payée</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
        </div>

        <!-- Invoices Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Facture</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (invoice of invoices(); track invoice.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium text-indigo-600">{{ invoice.invoice_number }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ invoice.client_name }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-500">{{ formatDate(invoice.issue_date) }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-500">{{ formatDate(invoice.due_date) }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-semibold text-gray-900">€{{ formatAmount(invoice.total) }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(invoice.status)">
                      {{ getStatusLabel(invoice.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-3">Voir</button>
                    <button class="text-gray-400 hover:text-gray-600">⋯</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `
})
export class InvoiceListComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  invoices = signal<Invoice[]>([
    { id: 1, invoice_number: 'INV-2026-0001', client_name: 'ABC Company', total: 1500, status: 'paid', issue_date: '2026-01-15', due_date: '2026-02-15' },
    { id: 2, invoice_number: 'INV-2026-0002', client_name: 'XYZ Sarl', total: 2300, status: 'sent', issue_date: '2026-01-28', due_date: '2026-02-28' },
    { id: 3, invoice_number: 'INV-2026-0003', client_name: 'John Doe', total: 800, status: 'overdue', issue_date: '2025-12-30', due_date: '2026-01-30' },
    { id: 4, invoice_number: 'INV-2026-0004', client_name: 'Acme Corp', total: 3400, status: 'paid', issue_date: '2026-02-01', due_date: '2026-03-01' },
    { id: 5, invoice_number: 'INV-2026-0005', client_name: 'Tech Solutions', total: 1200, status: 'draft', issue_date: '2026-02-13', due_date: '2026-03-13' }
  ]);
  
  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
  
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      paid: 'Payée',
      overdue: 'En retard'
    };
    return labels[status] || status;
  }
  
  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      draft: 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
      sent: 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
      paid: 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
      overdue: 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
    };
    return classes[status] || classes['draft'];
  }
  
  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
