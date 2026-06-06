import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  

private readonly API_URL = 'https://localhost:7146/api/auth';



  login(credentials: any) {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        // On stocke le TOKEN renvoyé par le C#
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        this.router.navigate(['/actifs']);
      })
    );
  }
getUsername(): string {
  return localStorage.getItem('username') || 'Invité';
}
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }


register(user: any) {
  return this.http.post<any>(`${this.API_URL}/register`, user);
}

}