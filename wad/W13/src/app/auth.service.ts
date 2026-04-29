import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private storageKey = 'auth_users';
    private sessionKey = 'auth_current';

    register(name: string, email: string, password: string): string | null {
        const users = this.getUsers();
        if (users[email]) return 'Email already registered.';
        users[email] = { name, email, password };
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return null;
    }

    login(email: string, password: string): string | null {
        const user = this.getUsers()[email];
        if (!user) return 'User not found.';
        if (user.password !== password) return 'Incorrect password.';
        sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
        return null;
    }

    logout() {
        sessionStorage.removeItem(this.sessionKey);
    }

    getCurrentUser() {
        const raw = sessionStorage.getItem(this.sessionKey);
        return raw ? JSON.parse(raw) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getCurrentUser();
    }

    private getUsers(): Record<string, any> {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : {};
    }
}
