import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { RubricDialogComponent } from '../rubric-dialog/rubric-dialog.component';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  codeid;code;codeContent;filename;filesize;filetype;
  username;
  comments;
  language = null;

  @ViewChild('commentform', { static: false }) commentForm: NgForm;
  @ViewChild('comment') con: ElementRef;
  thecomment = { clear: '' };
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient, private authService: AuthService, public dialog: MatDialog) {
    this.codeid = this.router.getCurrentNavigation().extras.state;
  }

  editorOptions = { theme: 'vs-dark', language: this.language };

  openDialog() {
    const dialogRef = this.dialog.open(RubricDialogComponent);
  }

  ngOnInit() {
    const reqObject = {
      _id: this.codeid
    };

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    this.http.post('http://localhost:3000/code/code', reqObject, { headers: headers }).subscribe(
      (response) => {
        this.code = response;
        this.filename = this.code.codes.filename;
        this.codeContent = this.code.codes.content;
        this.filetype = this.filename.split('.');
        this.language = this.filetype[1];
      },
      // If there is an error
      (error) => {
        console.log(error);
      },
      // When observable completes
      () => {
      }
    );

    this.getComments();
    this.getUsername();
  }

  getComments() {
    const reqObject = {
      _id: this.codeid
    };
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    this.http.post('http://localhost:3000/code/comment/listofcomment', reqObject, { headers: headers }).subscribe(
      (response) => {
        this.comments = response;
        this.comments = this.comments.comments;
      },
      // If there is an error
      (error) => {
        console.log(error);
      },
      // When observable completes
      () => {
      }
    )
  }

  onAddComment() {
    const comment = this.commentForm.value.comment;

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    const reqObject = {
      comment: comment,
      userid: this.authService.getUserId(),
      codeid: this.codeid,
      username: this.username
    };

    this.http.post('http://localhost:3000/code/comment/addComment', reqObject, { headers: headers }).subscribe(

      // The response data
      (response) => {
        this.con.nativeElement.value = "";
        this.getComments();
      },

      // If there is an error
      (error) => {
        // this.message = error.error.msg;
        console.log(error);
      },

      // When observable completes
      () => {
      }

    );
  }

  getUsername(){
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const reqObject = {
      _id: this.authService.getUserId()
    };

    this.http.post('http://localhost:3000/user/useridexists', reqObject, { headers: headers }).subscribe(

      // The response data
      (response) => {
        this.username = response;
        this.username = this.username.username;
      },

      // If there is an error
      (error) => {
        // this.message = error.error.msg;
        console.log(error);
      },

      // When observable completes
      () => {
      }

    );

  }
}
