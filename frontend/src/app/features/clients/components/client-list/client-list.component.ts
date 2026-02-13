import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  private router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private clientService: ClientService = inject(ClientService);
  
  clients = signal<Client[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  
  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      return;
    }
    this.loadClients();
  }
  
  loadClients() {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Load clients error:', err);
        
        if (err.status === 0) {
          this.errorMessage.set('Impossible de contacter le serveur.');
        } else {
          this.errorMessage.set('Erreur lors du chargement des clients.');
        }
      }
    });
  }
  
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
