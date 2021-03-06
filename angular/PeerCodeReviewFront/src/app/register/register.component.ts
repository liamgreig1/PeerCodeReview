import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('registerform', { static: false }) registerForm: NgForm;
  constructor(private http: HttpClient, private router: Router) { }

  message: String;

  onRegisterSubmit() {
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    const confirmPassword = this.registerForm.value.confirmPassword;

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    const reqObject = {
      username: username,
      password: password,
      score: 0
    };

    if (password != confirmPassword) {
      this.message = "Passwords do not match";
    } else {
      this.http.post('http://localhost:3000/user/register', reqObject, { headers: headers }).subscribe(

        // The response data
        (response) => {
          this.router.navigate(['/login']);
        },

        // If there is an error
        (error) => {
          this.message = error.error.msg;
          console.log(error);
        },

        // When observable completes
        () => {
        }

      );
    }
  }

  ngOnInit() {
  }

}
