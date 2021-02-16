import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginform', { static: false }) loginForm: NgForm;
  constructor() { }

  onLoginSubmit() {
    console.log(this.loginForm.value.username);
    console.log(this.loginForm.value.password);
  }

  ngOnInit(): void {
  }

}
