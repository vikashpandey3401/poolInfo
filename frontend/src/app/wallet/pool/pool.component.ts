import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoolService, PoolSubscription } from '../../pool.service';
import { AuthService, User } from '../../auth.service';

@Component({
    selector: 'app-pool',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './pool.component.html',
    styleUrl: './pool.component.css'
})
export class PoolComponent implements OnInit {
    parents: any[] = [];
    followers: any[] = [];
    currentSub: PoolSubscription | null = null;
    margin = 3.0; // Default $3 as mentioned by user
    loading = false;
    message = '';
    currentUser: User | null = null;

    constructor(private poolService: PoolService, private authService: AuthService) {
        this.currentUser = this.authService.currentUserValue;
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        // Load parents (filter out self)
        this.poolService.getParents().subscribe({
            next: (data) => {
                this.parents = data.filter(p => String(p.id) !== String(this.currentUser?.id));
            },
            error: (err) => console.error('Failed to load parents', err)
        });

        // Load followers if parent
        if (this.currentUser?.role === 'PARENT') {
            this.poolService.getFollowers().subscribe({
                next: (data) => this.followers = data,
                error: (err) => console.error('Failed to load followers', err)
            });
        }

        this.poolService.getCurrentSubscription().subscribe({
            next: (data) => {
                this.currentSub = data;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                console.error('Failed to load subscription', err);
            }
        });
    }

    joinPool(parentId: number): void {
        if (this.margin <= 0) {
            this.message = 'Please set a valid margin';
            return;
        }

        this.loading = true;
        this.poolService.joinPool(parentId, this.margin).subscribe({
            next: (res) => {
                this.currentSub = res;
                this.message = 'Joined pool successfully!';
                this.loading = false;
                setTimeout(() => this.message = '', 3000);
            },
            error: (err) => {
                this.message = err.error?.error || 'Failed to join pool';
                this.loading = false;
            }
        });
    }

    leavePool(): void {
        if (!this.currentSub) return;

        this.loading = true;
        this.poolService.leavePool(this.currentSub.parent_id).subscribe({
            next: () => {
                this.currentSub = null;
                this.message = 'Left pool successfully';
                this.loading = false;
                setTimeout(() => this.message = '', 3000);
            },
            error: (err) => {
                this.message = err.error?.error || 'Failed to leave pool';
                this.loading = false;
            }
        });
    }
}
