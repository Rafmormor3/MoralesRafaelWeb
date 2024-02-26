import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidateDateService {

  isValidDate(control : Date){

    //isNan verifica si hay numeros o no en la fecha
    if (isNaN(control.getTime())) {
      // La fecha ingresada no es válida
      return false;
    }
    return true; // La fecha es válida
  }

  endAfter(field1:Date, field2:Date):boolean{

    const today = new Date()

    // fecha sin la hora
    const field1DateOnly = new Date(field1.getFullYear(), field1.getMonth(), field1.getDate());
    const field2DateOnly = new Date(field2.getFullYear(), field2.getMonth(), field2.getDate());
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if(field1DateOnly>field2DateOnly){
      return false;
    }

    if(field1DateOnly<todayDateOnly){
      return false;
    }

    return true;


  }

  constructor() { }
}
