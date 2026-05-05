import { Injectable } from '@angular/core';

type User = {
  name: string;
  email: string;
  password: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersKey = 'simple_users';
  private readonly currentUserKey = 'simple_current_user';

  register(user: User): { ok: boolean; message: string } {
    const users = this.getUsers();
    const exists = users.some((u) => u.email === user.email);
    if (exists) {
      return { ok: false, message: 'Email already registered' };
    }
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return { ok: true, message: 'Registration successful' };
  }

  login(email: string, password: string): { ok: boolean; message: string } {
    const user = this.getUsers().find((u) => u.email === email && u.password === password);
    if (!user) {
      return { ok: false, message: 'Invalid email or password' };
    }
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    return { ok: true, message: 'Login successful' };
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.currentUserKey);
    return raw ? JSON.parse(raw) : null;
  }

  private getUsers(): User[] {
    const raw = localStorage.getItem(this.usersKey);
    return raw ? JSON.parse(raw) : [];
  }
}
