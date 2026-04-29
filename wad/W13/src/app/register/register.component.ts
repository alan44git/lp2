import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    name = ''; email = ''; password = ''; error = ''; success = '';

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit() {
        this.error = ''; this.success = '';
        if (!this.name || !this.email || !this.password) { this.error = 'All fields required.'; return; }
        const err = this.auth.register(this.name, this.email, this.password);
        if (err) { this.error = err; return; }
        this.success = 'Registered! Redirecting...';
        setTimeout(() => this.router.navigate(['/login']), 1200);
    }
}
