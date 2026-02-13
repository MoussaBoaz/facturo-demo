import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: any;
}

interface RegisterResponse {
  message: string;
  user: any;
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private http = inject(HttpClient);
  
  constructor(private router: Router) {}
  
  private getApiUrl(): string {
    // En production, utiliser l'URL de l'API déployée
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      return 'https://facturo-api.onrender.com/api';
    }
    // En local, utiliser localhost
    return 'http://localhost:8000/api';
  }
  
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.getApiUrl()}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.setUser(response.user);
      })
    );
  }
  
  register(name: string, email: string, password: string, password_confirmation: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.getApiUrl()}/auth/register`, {
      name,
      email,
      password,
      password_confirmation
    }).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.setUser(response.user);
      })
    );
  }
  
  logout(): void {
    // Appeler l'API pour invalider le token (optionnel mais propre)
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.getApiUrl()}/auth/logout`, {}).subscribe({
        next: () => this.clearAndRedirect(),
        error: () => this.clearAndRedirect() // Même si l'API échoue, on déconnecte localement
      });
    } else {
      this.clearAndRedirect();
    }
  }
  
  private clearAndRedirect(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }
  
  clearAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  
  getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  
  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Vérifier si le token est expiré (JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
}

// Guard pour routes protégées (nécessite authentification)
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Rediriger vers login avec return URL
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
  return false;
};

// Guard pour routes publiques (redirige si déjà connecté)
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
};
