import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateUserService {

  
  //Validamos que tanto el password como el passwordRep sean iguales, si no es asi, mandamos un error. 
  passwords(field1:string, field2:string):ValidatorFn{

    return(formControl:AbstractControl):ValidationErrors | null =>{

      const control2: FormControl = <FormControl>formControl.get(field2);

      const password : string = formControl.get(field1)?.value;
      const passwordRep : string = control2.value;

      if(password!==passwordRep){
        control2.setErrors({nonEquals:true})
        return {nonEquals:true}
      }

      return null

    }

  }

  constructor() { }


}
