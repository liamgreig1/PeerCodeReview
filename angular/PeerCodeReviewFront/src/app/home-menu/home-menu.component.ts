import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.css']
})
export class HomeMenuComponent implements OnInit {

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  user: String;
  ngOnInit() {

    const userId = this.authService.getUserId();

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    const reqObject = {
      _id: userId
    };

    this.http.post('http://localhost:3000/user/useridexists', reqObject, { headers: headers }).subscribe(

      // The response data
      (response) => {
        // If the user authenticates successfully, we need to store the JWT returned in localStorage
        this.user = response['username'];
      },

      // If there is an error
      (error) => {
        console.log(error);
      },

      // When observable completes
      () => {
        console.log('done!');
      }

    );

    
  }

}
