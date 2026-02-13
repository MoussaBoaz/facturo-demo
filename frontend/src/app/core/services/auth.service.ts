import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  
  constructor(private router: Router) {}
  
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
  
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }
  
  clearAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
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
