import { Injectable } from '@angular/core';
import { formData } from '../interfaces/Pageable';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private formData!: formData;

  constructor() { }

  setFormData(data:formData):void{
    this.formData=data;
    console.log(this.formData)
  }

  getFormData():formData{
    return this.formData;
  }
}
