import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
    id: number;
    username: string;
    role: string;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUserSubject.next(JSON.parse(user));
        }
    }

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
            .pipe(tap((res: AuthResponse) => {
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                localStorage.setItem('user', JSON.stringify(res.user));
                this.currentUserSubject.next(res.user);
            }));
    }

    register(username: string, email: string, password: string, role: string = 'FOLLOWER', inviteCode?: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, { username, email, password, role, invite_code: inviteCode });
    }

    logout() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
                next: () => { },
                error: () => { }
            });
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }
}
