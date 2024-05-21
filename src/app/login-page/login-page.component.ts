import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  invalid:boolean = false;

  constructor(private authService: AuthServiceService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.authService.autoLogin();

  }

  creds = new FormGroup({
    user: new FormControl('', [Validators.maxLength(10),Validators.required]),
    password: new FormControl('',[Validators.required])
  });

  userv(){
    return this.creds.get('user');
  }
  passv(){
    return this.creds.get('password');
  }

  onLogin(): void {
    const adminID = this.creds.get('user')?.value || "";
    const password = this.creds.get('password')?.value || "";
    this.authService.login(adminID, password).subscribe(
      response => {
        if (response.data.access === "pass") {
          const jwtHelper = new JwtHelperService();
          const accessToken = response.data.accessToken;
          const expirationDate = jwtHelper.getTokenExpirationDate(accessToken);

          if (expirationDate) {
            localStorage.setItem('accessToken', accessToken);
            this.authService.isAuthenticated = true;
            const expiryTime = expirationDate.getTime() - new Date().getTime();
            this.authService.autoLogout(expiryTime);
            this.invalid = false;
            this.router.navigateByUrl('user-table-component');
          } else {
            this.invalid = true;
          }
        } else {
          this.invalid = true;
        }
      },
      error => {
        console.error("Error occurred during login:", error);
        alert("An error occurred during login. Please try again later.");
      }
    );
  }


}
