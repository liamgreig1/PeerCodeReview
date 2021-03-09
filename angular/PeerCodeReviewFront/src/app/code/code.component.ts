import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  codeid;
  code;
  codeContent;
  filename;
  filesize;
  filetype;
  language = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, private authService: AuthService) {
    this.codeid = this.router.getCurrentNavigation().extras.state;
  }

  editorOptions = { theme: 'vs-dark', language: this.language };

  ngOnInit() {

    const reqObject = {
      _id: this.codeid
    };

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    this.http.post('http://localhost:3000/code/code', reqObject, { headers: headers }).subscribe(

      (response) => {
        console.log(response);
        this.code = response;
        this.filename = this.code.codes.filename;
        this.codeContent = this.code.codes.content;
        this.filetype = this.filename.split('.');
        this.language = this.filetype[1];
        console.log(this.filename);
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

    console.log(this.code)
  }

}
