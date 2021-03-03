import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-protected-component',
  templateUrl: './protected-component.component.html',
  styleUrls: ['./protected-component.component.css']
})
export class ProtectedComponentComponent implements OnInit {

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  message: String
  onGetUsers(){
    this.http.get('http://localhost:3000/user/listofusers').subscribe(
      (response) => {
        if (response) {
          this.message = response['msg'][3]['username'];
          console.log(response['msg']);
        }
      },

      (error) => {
        if (error.status === 401) {
          this.message = 'You are not authorized to visit this route.  No data is displayed.';
        }
      }, 

      () => {
        console.log('HTTP request done');
      }
    );
  }

  onLogoutSubmit(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/user/protected').subscribe(
      (response) => {
        if (response) {
          this.message = 'You are authenticated!';
        }
      },

      (error) => {
        if (error.status === 401) {
          this.message = 'You are not authorized to visit this route.  No data is displayed.';
        }
      }, 

      () => {
        console.log('HTTP request done');
      }
    );
  }

}
