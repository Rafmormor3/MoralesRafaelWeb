import { Injectable } from '@angular/core';
import { formData } from '../interfaces/Pageable';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private formData!: formData;

  constructor() { }

  //Guaradamos los datos del formData que pasamos por parametro
  setFormData(data:formData):void{
    this.formData=data;
    //console.log(this.formData)
  }

  //Enviamos los datos del formDate
  getFormData():formData{
    return this.formData;
  }
}
