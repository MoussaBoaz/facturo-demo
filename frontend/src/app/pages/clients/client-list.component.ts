import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  total_invoices: number;
}

@Component({
  selector: 'app-client-list',
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
            <h1 class="text-2xl font-bold text-gray-900">Clients</h1>
            <p class="mt-1 text-sm text-gray-500">Gérez vos clients</p>
          </div>
          <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nouveau client
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <input type="text" 
                     placeholder="Rechercher un client..."
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
          </div>
        </div>

        <!-- Clients Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factures</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (client of clients(); track client.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-indigo-600 font-medium">{{ getInitials(client.name) }}</span>
                      </div>
                      <div class="ml-4">
                        <span class="text-sm font-medium text-gray-900">{{ client.name }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ client.company }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-500">{{ client.email }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-500">{{ client.phone }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ client.total_invoices }} factures
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
export class ClientListComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  clients = signal<Client[]>([
    { id: 1, name: 'ABC Company', email: 'contact@abc.com', company: 'ABC SARL', phone: '+32 123 456 789', total_invoices: 5 },
    { id: 2, name: 'XYZ Sarl', email: 'info@xyz.com', company: 'XYZ Industries', phone: '+32 987 654 321', total_invoices: 3 },
    { id: 3, name: 'John Doe', email: 'john@example.com', company: 'Freelance', phone: '+32 456 789 123', total_invoices: 2 },
    { id: 4, name: 'Acme Corp', email: 'hello@acme.com', company: 'Acme Corporation', phone: '+32 789 123 456', total_invoices: 8 },
    { id: 5, name: 'Tech Solutions', email: 'contact@techsolutions.be', company: 'Tech Solutions BV', phone: '+32 321 654 987', total_invoices: 1 }
  ]);
  
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
