import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    username = '';
    email = '';
    password = '';
    error = '';
    isLoading = false;

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.isLoading = true;
        this.error = '';
        this.authService.register(this.username, this.email, this.password).subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.error = err.error?.error || 'Registration failed';
                this.isLoading = false;
            }
        });
    }
}
