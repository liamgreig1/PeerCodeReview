import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @ViewChild('uploadform', { static: false }) uploadForm: NgForm;
  constructor() { }

  fileToUpload: File = null;
  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadDocument() { 
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    }
    fileReader.readAsText(this.fileToUpload);
    console.log(fileReader)
    console.log(this.fileToUpload.size)
    console.log(this.fileToUpload.name)
  }

}
