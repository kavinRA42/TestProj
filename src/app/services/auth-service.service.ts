import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  public isAuthenticated = false;
  public expiryTime: number = 60;

  constructor(private http: HttpClient, private router: Router) { }

  login(adminID: string, password: string): Observable<any> {
    const bodyData = {
      "adminID": adminID,
      "password": password
    };

    return this.http.post<any>("http://localhost:8081/login", bodyData);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiryAt');
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  // autoLogout(expiryTime: number): void {
  //   const currentTime = new Date().getTime();
  //   const timeLeft = expiryTime - currentTime;
  //   console.log(timeLeft);

  //   if (timeLeft > 0) {
  //     timer(timeLeft).subscribe(() => {
  //       this.logout();
  //     });
  //   } else {
  //     this.logout();
  //   }
  // }

  autoLogout(expiryTime: number): void {
    if (expiryTime > 0) {
      timer(expiryTime).subscribe(() => {
        this.logout();
      });
    } else {
      this.logout();
    }
  }

  autoLogin(): void {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      return;
    }

    const jwtHelper = new JwtHelperService();
    const expirationDate = jwtHelper.getTokenExpirationDate(accessToken);

    if (!expirationDate) {
      this.logout();
      return;
    }

    const currentTime = new Date().getTime();
    const expiryTime = expirationDate.getTime();

    console.log(expiryTime - currentTime);

    if (expiryTime > currentTime) {
      this.isAuthenticated = true;
      this.autoLogout(expiryTime - currentTime);
      this.router.navigate(['/user-table-component']);
    } else {
      this.logout();
    }
  }





  // autoLogin(): void {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const expiryAt = localStorage.getItem('expiryAt');

  //   if (!accessToken || !expiryAt) {
  //     return;
  //   }

  //   const expiryTime = parseInt(expiryAt);
  //   const currentTime = new Date().getTime();

  //   if (expiryTime > currentTime) {
  //     this.isAuthenticated = true;
  //     this.autoLogout(expiryTime);
  //     this.router.navigate(['/user-table-component']);
  //   } else {
  //     this.logout();
  //   }
  // }

}
