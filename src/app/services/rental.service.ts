import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental, formData } from '../interfaces/Pageable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  private url:string = "http://localhost:8082";

  constructor(private http: HttpClient) { }

  addRental(rental:Omit<Rental,"id">):Observable<Rental>{
    return this.http.post<Rental>(`${this.url}/rental`, rental);
  }

  available(form:formData):Observable<boolean>{
    return this.http.post<boolean>(`${this.url}/available`,form)
  }
}
