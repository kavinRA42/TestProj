import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isActiveLink = false;

  constructor(private router:Router, private authService:AuthServiceService) {
      this.router.events.subscribe((event)=>{
        if (event instanceof NavigationEnd) {
          this.isActiveLink = this.router.url === '/user-table-component';
        }
      });
   }

  ngOnInit(): void {
  }


  onLogout(){
    console.log("logouttt")
    this.authService.logout();
    
  }

}
