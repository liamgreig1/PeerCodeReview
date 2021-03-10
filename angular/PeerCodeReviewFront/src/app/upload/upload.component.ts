import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @ViewChild('uploadform', { static: false }) uploadForm: NgForm;
  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private fb: FormBuilder) { }

  fileToUpload: File = null;
  users: any;
  userArray: any
  userSelect: any;
  fileContent: any = "";
  message: String;
  fileMessage: String;
  language: String = "";
  randomUser: any;

  editorOptions = { theme: 'vs-dark', language: this.language };
  code: any;

  ngOnInit() {

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    this.http.get('http://localhost:3000/user/listofusers', { headers: headers }).subscribe(
      // The response data
      (response) => {
        this.users = response;
        this.userArray = this.users.msg
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

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload.size>20480) {
      this.fileToUpload = null;
      this.fileMessage = "File size too big"
    }
  }

  uploadDocument() {
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.fileContent = fileReader.result;
      this.code = fileReader.result;
      var filetype = this.fileToUpload.name.split(".");
      this.language = filetype[1];
    }
    fileReader.readAsText(this.fileToUpload);
  }

  submitForReview() {
    const filename = this.fileToUpload.name;
    const filesize = this.fileToUpload.size;
    const authorId = this.authService.getUserId();
    const reviewer = this.userSelect;

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });

    const reqObject = {
      filename: filename,
      filesize: filesize,
      content: this.fileContent,
      author: authorId,
      reviewer: reviewer,
      status: false
    };


    this.http.post('http://localhost:3000/code/upload', reqObject, { headers: headers }).subscribe(
      // The response data
      (response) => {
        this.router.navigate(['/home']);
        this.message = "File uploaded successfully.";
      },

      // If there is an error
      (error) => {
        console.log(error);
        this.message = error.error.msg;

      },
      // When observable completes
      () => {
      }
    )



  }

}
