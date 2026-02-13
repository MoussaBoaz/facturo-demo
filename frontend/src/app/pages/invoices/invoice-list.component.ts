import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-white shadow-lg min-h-screen">
          <div class="flex items-center justify-center h-16 bg-indigo-600">
            <span class="text-white font-bold text-xl">Facturo</span>
          </div>
          <nav class="mt-8 px-4 space-y-2">
            <a routerLink="/dashboard" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span>Dashboard</span>
            </a>
            <a routerLink="/invoices" class="flex items-center px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <span>Factures</span>
            </a>
            <a routerLink="/clients" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span>Clients</span>
            </a>
          </nav>
        </aside>

        <!-- Main content -->
        <main class="flex-1 p-8">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Factures</h1>
            <a routerLink="/invoices/new" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              + Nouvelle facture
            </a>
          </div>

          <div class="bg-white rounded-xl shadow overflow-hidden">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Facture</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4">INV-2026-0001</td>
                  <td class="px-6 py-4">ABC Company</td>
                  <td class="px-6 py-4">€1,500.00</td>
                  <td class="px-6 py-4"><span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Payée</span></td>
                  <td class="px-6 py-4">13/02/2026</td>
                </tr>
                <tr>
                  <td class="px-6 py-4">INV-2026-0002</td>
                  <td class="px-6 py-4">XYZ Sarl</td>
                  <td class="px-6 py-4">€2,300.00</td>
                  <td class="px-6 py-4"><span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Envoyée</span></td>
                  <td class="px-6 py-4">13/02/2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  `
})
export class InvoiceListComponent {}
