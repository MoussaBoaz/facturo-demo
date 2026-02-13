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
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div class="flex items-center justify-center h-16 bg-indigo-600">
          <span class="text-white font-bold text-xl">Facturo</span>
        </div>
        <nav class="mt-8 px-4 space-y-2">
          <a routerLink="/dashboard" class="flex items-center px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </a>
          <a routerLink="/invoices" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Factures
          </a>
          <a routerLink="/clients" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Clients
          </a>
          <button (click)="logout()" class="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg text-left">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="ml-64 p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p class="mt-2 text-gray-600">Vue d'ensemble de votre activité</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-blue-100 text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Factures</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats()?.total_invoices || 0 }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-green-100 text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Payé</p>
                <p class="text-2xl font-bold text-green-600">€{{ formatPrice(stats()?.total_paid) }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">En attente</p>
                <p class="text-2xl font-bold text-yellow-600">€{{ formatPrice(stats()?.total_pending) }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-red-100 text-red-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">En retard</p>
                <p class="text-2xl font-bold text-red-600">€{{ formatPrice(stats()?.total_overdue) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Invoices -->
        <div class="bg-white rounded-xl shadow">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Factures récentes</h2>
            <a routerLink="/invoices" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Voir tout</a>
          </div>
          <div class="divide-y divide-gray-200">
            @for (invoice of recentInvoices(); track invoice.id) {
              <div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</p>
                  <p class="text-sm text-gray-500">{{ invoice.client.name }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">€{{ formatPrice(invoice.total) }}</p>
                  <span class="inline-flex px-2 py-1 text-xs rounded-full"
                    [class.bg-gray-100]="invoice.status === 'draft'"
                    [class.text-gray-800]="invoice.status === 'draft'"
                    [class.bg-blue-100]="invoice.status === 'sent'"
                    [class.text-blue-800]="invoice.status === 'sent'"
                    [class.bg-green-100]="invoice.status === 'paid'"
                    [class.text-green-800]="invoice.status === 'paid'"
                    [class.bg-red-100]="invoice.status === 'overdue'"
                    [class.text-red-800]="invoice.status === 'overdue'">
                    {{ getStatusLabel(invoice.status) }}
                  </span>
                </div>
              </div>
            } @empty {
              <div class="px-6 py-8 text-center text-gray-500">
                Aucune facture encore. <a routerLink="/invoices/new" class="text-indigo-600 hover:underline">Créer votre première facture</a>
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
  
  stats = signal<DashboardStats | null>(null);
  recentInvoices = signal<Invoice[]>([]);
  
  constructor() {
    // TODO: Fetch from API
    // Simulated data for demo
    this.stats.set({
      total_invoices: 12,
      total_paid: 8500,
      total_pending: 3200,
      total_overdue: 800
    });
    
    this.recentInvoices.set([
      { id: 1, invoice_number: 'INV-2026-0001', total: 1500, status: 'paid', due_date: '2026-02-15', client: { name: 'ABC Company' } },
      { id: 2, invoice_number: 'INV-2026-0002', total: 2300, status: 'sent', due_date: '2026-02-28', client: { name: 'XYZ Sarl' } },
      { id: 3, invoice_number: 'INV-2026-0003', total: 800, status: 'overdue', due_date: '2026-01-30', client: { name: 'John Doe' } }
    ]);
  }
  
  formatPrice(price: number | undefined): string {
    return price?.toFixed(2) || '0.00';
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
  
  logout() {
    this.router.navigate(['/']);
  }
}
