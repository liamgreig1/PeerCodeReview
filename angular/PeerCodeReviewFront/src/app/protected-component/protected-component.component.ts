import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-protected-component',
  templateUrl: './protected-component.component.html',
  styleUrls: ['./protected-component.component.css']
})
export class ProtectedComponentComponent implements OnInit {

  constructor(private http: HttpClient) { }

  message: String

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
