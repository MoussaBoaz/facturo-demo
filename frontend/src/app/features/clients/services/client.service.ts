import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CreateClientRequest, UpdateClientRequest } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  
  private getApiUrl(): string {
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      return 'https://facturo-api.onrender.com/api';
    }
    return 'http://localhost:8000/api';
  }
  
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.getApiUrl()}/clients`);
  }
  
  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.getApiUrl()}/clients/${id}`);
  }
  
  createClient(client: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(`${this.getApiUrl()}/clients`, client);
  }
  
  updateClient(id: number, client: UpdateClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.getApiUrl()}/clients/${id}`, client);
  }
  
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getApiUrl()}/clients/${id}`);
  }
}
