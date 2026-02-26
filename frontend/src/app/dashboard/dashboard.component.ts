import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    user: User | null = null;

    constructor(private authService: AuthService, private router: Router) {
        this.user = this.authService.currentUserValue;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
