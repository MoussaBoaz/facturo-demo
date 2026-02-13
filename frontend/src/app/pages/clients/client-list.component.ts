import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-list',
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
            <a routerLink="/invoices" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span>Factures</span>
            </a>
            <a routerLink="/clients" class="flex items-center px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <span>Clients</span>
            </a>
          </nav>
        </aside>

        <!-- Main content -->
        <main class="flex-1 p-8">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Clients</h1>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              + Nouveau client
            </button>
          </div>

          <div class="bg-white rounded-xl shadow overflow-hidden">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 font-medium">ABC Company</td>
                  <td class="px-6 py-4">contact@abc.com</td>
                  <td class="px-6 py-4">ABC SARL</td>
                  <td class="px-6 py-4">+32 123 456 789</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 font-medium">XYZ Sarl</td>
                  <td class="px-6 py-4">info@xyz.com</td>
                  <td class="px-6 py-4">XYZ Industries</td>
                  <td class="px-6 py-4">+32 987 654 321</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  `
})
export class ClientListComponent {}
