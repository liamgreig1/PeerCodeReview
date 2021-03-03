import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @ViewChild('logout', { static: false }) logout: NgForm;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
