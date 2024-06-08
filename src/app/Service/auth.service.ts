import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
  getRole(): string | null {
    return localStorage.getItem('role');
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('username');
  }
}
