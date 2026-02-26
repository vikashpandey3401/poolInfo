import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService, Balance } from '../../wallet.service';

@Component({
    selector: 'app-balance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './balance.component.html',
    styleUrl: './balance.component.css'
})
export class BalanceComponent implements OnInit {
    balance: Balance = { available_balance: 0, locked_balance: 0 };
    loading = true;
    error = '';
    depositAmount = 0;
    depositMessage = '';

    constructor(private walletService: WalletService) { }

    ngOnInit(): void {
        this.loadBalance();
    }

    loadBalance(): void {
        this.loading = true;
        this.walletService.getBalance().subscribe({
            next: (data) => {
                this.balance = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load balance';
                this.loading = false;
                console.error(err);
            }
        });
    }

    depositFunds(): void {
        if (this.depositAmount <= 0) {
            this.depositMessage = 'Amount must be greater than zero';
            return;
        }

        this.walletService.deposit(this.depositAmount).subscribe({
            next: () => {
                this.depositMessage = 'Funds deposited successfully!';
                this.loadBalance();
                this.depositAmount = 0;
            },
            error: (err) => {
                this.depositMessage = err.error?.error || 'Failed to deposit funds';
            }
        });
    }
}
