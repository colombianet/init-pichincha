import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanLoad {

  constructor(private router: Router) {}

  canLoad(): boolean {
    const token = sessionStorage.getItem('token');

    if (token) {
      return true;
    } else {
      this.router.navigate(['/auth', 'login']);
      return false;
    }
  }
}
