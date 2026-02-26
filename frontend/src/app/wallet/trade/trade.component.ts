import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../wallet.service';

@Component({
    selector: 'app-trade',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './trade.component.html',
    styleUrl: './trade.component.css'
})
export class TradeComponent implements OnInit {
    margin = 0;
    pnl = 0;
    tradeUuid = '';
    loading = false;
    message = '';
    messageType: 'success' | 'error' = 'success';
    activeTrades: any[] = [];

    constructor(private walletService: WalletService) { }

    ngOnInit(): void {
        this.loadActiveTrades();
    }

    loadActiveTrades(): void {
        this.walletService.getActiveTrades().subscribe({
            next: (trades) => this.activeTrades = trades,
            error: (err) => console.error('Failed to load active trades', err)
        });
    }

    openTrade(): void {
        if (this.margin <= 0) {
            this.showMessage('Margin must be greater than zero', 'error');
            return;
        }

        this.loading = true;
        this.walletService.openTrade(this.margin).subscribe({
            next: (res) => {
                this.tradeUuid = res.tradeUuid;
                this.showMessage(`Trade opened successfully! UUID: ${this.tradeUuid}`, 'success');
                this.loading = false;
                this.loadActiveTrades();
                this.margin = 0;
            },
            error: (err) => {
                this.showMessage(err.error?.error || 'Failed to open trade', 'error');
                this.loading = false;
            }
        });
    }

    closeTrade(uuid?: string, pnl?: number): void {
        const targetUuid = uuid || this.tradeUuid;
        const targetPnL = pnl !== undefined ? pnl : this.pnl;

        if (!targetUuid) {
            this.showMessage('No active trade UUID to close', 'error');
            return;
        }

        this.loading = true;
        this.walletService.closeTrade(targetUuid, targetPnL).subscribe({
            next: (res) => {
                this.showMessage(`Trade closed successfully! PNL: ${targetPnL}`, 'success');
                if (targetUuid === this.tradeUuid) this.tradeUuid = '';
                this.loading = false;
                this.loadActiveTrades();
            },
            error: (err) => {
                this.showMessage(err.error?.error || 'Failed to close trade', 'error');
                this.loading = false;
            }
        });
    }

    private showMessage(msg: string, type: 'success' | 'error'): void {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => this.message = '', 5000);
    }
}
