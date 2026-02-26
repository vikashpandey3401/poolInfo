import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PoolSubscription {
    id: number;
    follower_id: number;
    parent_id: number;
    parent_name?: string;
    fixed_margin: number;
    status: 'ACTIVE' | 'INACTIVE';
}

@Injectable({
    providedIn: 'root'
})
export class PoolService {
    private apiUrl = 'http://localhost:3000/api/pool';

    constructor(private http: HttpClient) { }

    getParents(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/parents`);
    }

    joinPool(parentId: number, fixedMargin: number): Observable<PoolSubscription> {
        return this.http.post<PoolSubscription>(`${this.apiUrl}/join`, { parentId, fixedMargin });
    }

    leavePool(parentId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/leave`, { parentId });
    }

    getCurrentSubscription(): Observable<PoolSubscription | null> {
        return this.http.get<PoolSubscription | null>(`${this.apiUrl}/current`);
    }

    getFollowers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/followers`);
    }
}
