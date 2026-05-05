import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <h2>Register</h2>
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="name" name="name" placeholder="Name" required />
      <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required />
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p>{{ message }}</p>
    <a routerLink="/login">Go to Login</a>
  `,
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    const result = this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password,
    });
    this.message = result.message;
    if (result.ok) {
      this.router.navigate(['/login']);
    }
  }
}
