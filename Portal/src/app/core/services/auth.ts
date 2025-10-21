import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '../models/authresponse.model';
import { LoginRequest } from '../models/loginrequest.model';
import { RegisterRequest } from '../models/registerrequest.model';
import { User } from '../models/user.model';
import { UserRole } from '../models/userrole.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  private apiUrl = `${environment.authAPIBaseUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private get storage(): Storage | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  }

  /**
   * Login user with username and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  /**
   * Refresh JWT token using refresh token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.storage?.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  /**
   * Logout user and clear storage
   */
  logout(): void {
    this.storage?.removeItem('token');
    this.storage?.removeItem('refreshToken');
    this.storage?.removeItem('user');

    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Handle authentication response
   */
  private handleAuthResponse(response: AuthResponse): void {
    if (!this.storage) return;
    this.storage.setItem('token', response.token);
    this.storage.setItem('refreshToken', response.refreshToken);
    this.storage.setItem('user', JSON.stringify(response));
    // this.currentUserSubject.next(response);
  }

  /**
   * Load user from localStorage on app initialization
   */
  private loadUserFromStorage(): void {
    if (!this.storage) return;

    console.log('Loading token from storage', this.storage.getItem('token'));
    console.log('Loading user from storage', this.storage.getItem('user'));

    const token = this.storage.getItem('token');
    const userJson = this.storage.getItem('user');

    if (token && userJson && !this.isTokenExpired(token)) {
      this.currentUserSubject.next(JSON.parse(userJson));
    } else if (token && this.isTokenExpired(token)) {
      this.refreshToken().subscribe({
        error: () => this.logout()
      });
    }
  }

  /**
   * Get current JWT token
   */
  getToken(): string | null {
    return this.storage?.getItem('token') || null;
  }

  /**
   * Get current logged-in user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserRoles(): UserRole[] | null {
    const token = this.storage?.getItem('user');
    return token ? JSON.parse(token).roles || null : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Check if JWT token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return true;

      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    } catch {
      return true;
    }
  }

  /**
   * Check if current user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.getCurrentUserRoles()?.includes(role) || false;
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('DISPUTE_ADMIN');
  }

  /**
   * Check if current user is customer
   */
  isCustomer(): boolean {
    return this.hasRole('CUSTOMER');
  }

  /**
   * Get user ID from current user
   */
  getUserId(): string | null {
    return this.getCurrentUser()?.id || null;
  }

  /**
   * Update user profile in storage (after profile updates)
   */
  updateUserProfile(user: User): void {
    if (!this.storage) return;
    this.storage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
