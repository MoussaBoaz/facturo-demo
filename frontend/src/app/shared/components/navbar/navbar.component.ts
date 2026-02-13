import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <a routerLink="/" class="flex items-center text-xl font-bold text-indigo-600">
              Starter
            </a>
          </div>
          <div class="flex items-center space-x-4">
            <a routerLink="/login" 
               routerLinkActive="text-indigo-600"
               class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </a>
            <a routerLink="/register"
               routerLinkActive="text-indigo-600" 
               class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium">
              Register
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
