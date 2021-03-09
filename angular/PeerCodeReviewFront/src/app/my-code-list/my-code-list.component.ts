import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-code-list',
  templateUrl: './my-code-list.component.html',
  styleUrls: ['./my-code-list.component.css']
})
export class MyCodeListComponent implements OnInit {

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  codes: any;
  listofcode: any;

  ngOnInit() {

    const userId = this.authService.getUserId();

    const reqObject = {
      _id: userId
    };

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    this.http.post('http://localhost:3000/code/listauthor', reqObject, { headers: headers }).subscribe(
      (response) => {
        this.codes = response;
        this.listofcode = this.codes.codes
        console.log(userId)
        console.log(response);
        console.log(this.listofcode)
      },

      // If there is an error
      (error) => {
        console.log(error);
      },
      // When observable completes
      () => {
        console.log('done!');
      }
    )
  }

}
