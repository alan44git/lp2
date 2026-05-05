import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Profile</h2>
    @if (user) {
      <p><b>Name:</b> {{ user.name }}</p>
      <p><b>Email:</b> {{ user.email }}</p>
      <button (click)="logout()">Logout</button>
    } @else {
      <p>Please login first.</p>
      <a routerLink="/login">Go to Login</a>
    }
  `,
})
export class ProfileComponent {
  user: { name: string; email: string; password: string } | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getCurrentUser();
  }

  logout(): void {
    this.auth.logout();
    this.user = null;
    this.router.navigate(['/login']);
  }
}
