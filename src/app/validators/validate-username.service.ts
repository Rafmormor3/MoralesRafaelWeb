import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateUsernameService implements AsyncValidator{

  constructor( private http: HttpClient) { }

  validate(control:AbstractControl):Observable<ValidationErrors | null> {

    const username = control.value;
    console.log(username)

    return this.http.get<any[]>(`http://localhost:8082/user/username?username=${username}`).pipe(
      map(resp=>{
        return (resp.length===0)? null : {usernameTaken:true}
      }),
      catchError(error=>of(null))// convierte
    )

  }
  
}
