import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  public seedingDate:string = '';
  public captureDate:string = '';
  public selectedFile!: File;
  public responseImageUrl: string = '';
  public showLoader = false;
  public showImage = false;

  public onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  public fetchChlorophyll() {
    let formValidationEror = false;
    var seedingDateElm = document.getElementById('seedingDate');
    if(seedingDateElm) {
      this.seedingDate = (seedingDateElm as HTMLInputElement).value;
      if(this.seedingDate == '' || this.seedingDate == null) {
        alert('Seeding date must be selected');
        formValidationEror = true;
      }
    }

    var captureDateElm = document.getElementById('captureDate');
    if(captureDateElm) {
      this.captureDate = (captureDateElm as HTMLInputElement).value;
      if(this.captureDate == '' || this.captureDate == null) {
        alert('Image capture date must be selected');
        formValidationEror = true;
      }
    }

    if(Date.parse(this.seedingDate) > Date.parse(this.captureDate)) {
      alert('Seeding date must be a previous date than image capture date');
      formValidationEror = true;
    }

    if(!this.selectedFile) {
      alert('A calibrated image has to be selected');
      formValidationEror = true;
    }

    if(formValidationEror) {
      return;
    }

    const formData = new FormData();
    formData.append('seedingDate', this.seedingDate);
    formData.append('captureDate', this.captureDate);
    formData.append('selectedFile', this.selectedFile);

    const url = 'https://26d0-65-39-45-111.ngrok-free.app/image';

    let options = {
      method: "POST",
      header: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin":  "*",
        "Access-Control-Allow-Methods": "POST",
      },
      body: formData
    };
    
    this.showLoader = true;
    this.showImage = false;
    fetch(url, options)
      .then((response) => {
        if(response.ok) {
          return response.blob()
        }
        else throw new Error('Problem occured')
      })
      .then(imageBlob => {
        // Create a URL for the Blob
        const imageObjectURL = URL.createObjectURL(imageBlob);
        // Set the src attribute of the image element to the Blob URL
        this.responseImageUrl = imageObjectURL;
        this.showLoader = false;
        this.showImage = true;
        console.log(this.responseImageUrl)
      })
      .catch((error) => {
        this.showLoader = false;
        this.showImage = false;
        console.log(error);
      });
  }
}
