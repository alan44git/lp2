import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    email = ''; password = ''; error = '';

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit() {
        this.error = '';
        if (!this.email || !this.password) { this.error = 'All fields required.'; return; }
        const err = this.auth.login(this.email, this.password);
        if (err) { this.error = err; return; }
        this.router.navigate(['/profile']);
    }
}
