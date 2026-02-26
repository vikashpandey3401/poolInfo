import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService, Transaction } from '../../wallet.service';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
    transactions: Transaction[] = [];
    loading = true;
    error = '';

    constructor(private walletService: WalletService) { }

    ngOnInit(): void {
        this.loadHistory();
    }

    loadHistory(): void {
        this.loading = true;
        this.walletService.getHistory().subscribe({
            next: (data) => {
                this.transactions = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load transaction history';
                this.loading = false;
                console.error(err);
            }
        });
    }

    getTransactionClass(type: string): string {
        switch (type) {
            case 'DEPOSIT': return 'text-green-500 font-bold';
            case 'WITHDRAW': return 'text-red-500 font-bold';
            case 'LOCK': return 'text-yellow-500 font-bold';
            case 'UNLOCK': return 'text-blue-500 font-bold';
            case 'TRADE_PNL': return 'text-purple-500 font-bold';
            default: return 'text-gray-300 font-bold';
        }
    }
}
