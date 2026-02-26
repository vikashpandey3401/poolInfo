import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Balance {
    available_balance: number;
    locked_balance: number;
}

export interface Transaction {
    id: number;
    type: string;
    amount: number;
    available_before: number;
    available_after: number;
    locked_before: number;
    locked_after: number;
    reference_id: string;
    metadata: any;
    created_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private apiUrl = 'http://localhost:3000/api/wallet';

    constructor(private http: HttpClient) { }

    getBalance(): Observable<Balance> {
        return this.http.get<Balance>(`${this.apiUrl}/balance`);
    }

    getHistory(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/history`);
    }

    openTrade(margin: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/trade/open`, { margin });
    }

    closeTrade(tradeUuid: string, pnl: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/trade/close`, { tradeUuid, pnl });
    }

    deposit(amount: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/deposit`, { amount });
    }

    getActiveTrades(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/trade/active`);
    }
}
