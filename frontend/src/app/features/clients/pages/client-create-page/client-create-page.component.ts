import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ClientFormComponent } from '../components/client-form/client-form.component';
import { ClientService } from '../services/client.service';
import { CreateClientRequest } from '../models/client.model';

@Component({
  selector: 'app-client-create-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ClientFormComponent],
  templateUrl: './client-create-page.component.html',
  styleUrls: ['./client-create-page.component.scss']
})
export class ClientCreatePageComponent {
  private router = inject(Router);
  private clientService: ClientService = inject(ClientService);
  
  loading = signal(false);
  errorMessage = signal('');
  
  onSave(client: CreateClientRequest) {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.clientService.createClient(client).subscribe({
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
  
  onCancel() {
    this.router.navigate(['/clients']);
  }
}
