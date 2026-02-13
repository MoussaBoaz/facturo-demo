import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface DashboardStats {
  total_invoices: number;
  total_paid: number;
  total_pending: number;
  total_overdue: number;
}

interface Invoice {
  id: number;
  invoice_number: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  client: { name: string };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p class="mt-1 text-sm text-gray-500">Vue d'ensemble de votre activité</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Invoices -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-blue-50 text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Factures</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats().total_invoices }}</p>
              </div>
            </div>
          </div>

          <!-- Paid -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-green-50 text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Payé</p>
                <p class="text-2xl font-bold text-green-600">€{{ formatAmount(stats().total_paid) }}</p>
              </div>
            </div>
          </div>

          <!-- Pending -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">En attente</p>
                <p class="text-2xl font-bold text-yellow-600">€{{ formatAmount(stats().total_pending) }}</p>
              </div>
            </div>
          </div>

          <!-- Overdue -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-red-50 text-red-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">En retard</p>
                <p class="text-2xl font-bold text-red-600">€{{ formatAmount(stats().total_overdue) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Invoices -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Factures récentes</h2>
            <a routerLink="/invoices" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Voir tout →
            </a>
          </div>
          <div class="divide-y divide-gray-200">
            @for (invoice of recentInvoices(); track invoice.id) {
              <div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ invoice.invoice_number }}</p>
                  <p class="text-sm text-gray-500">{{ invoice.client.name }}</p>
                </div>
                <div class="flex items-center space-x-4">
                  <p class="text-sm font-semibold text-gray-900">€{{ formatAmount(invoice.total) }}</p>
                  <span [class]="getStatusClass(invoice.status)">
                    {{ getStatusLabel(invoice.status) }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {
  private router = inject(Router);
  
  stats = signal<DashboardStats>({
    total_invoices: 12,
    total_paid: 8500,
    total_pending: 3200,
    total_overdue: 800
  });
  
  recentInvoices = signal<Invoice[]>([
    { id: 1, invoice_number: 'INV-2026-0001', total: 1500, status: 'paid', due_date: '2026-02-15', client: { name: 'ABC Company' } },
    { id: 2, invoice_number: 'INV-2026-0002', total: 2300, status: 'sent', due_date: '2026-02-28', client: { name: 'XYZ Sarl' } },
    { id: 3, invoice_number: 'INV-2026-0003', total: 800, status: 'overdue', due_date: '2026-01-30', client: { name: 'John Doe' } },
    { id: 4, invoice_number: 'INV-2026-0004', total: 3400, status: 'paid', due_date: '2026-03-10', client: { name: 'Acme Corp' } }
  ]);
  
  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
      draft: 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
      sent: 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
      paid: 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
      overdue: 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
    };
    return classes[status] || classes['draft'];
  }
  
  logout(): void {
    this.router.navigate(['/login']);
  }
}
