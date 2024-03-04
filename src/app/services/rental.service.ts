import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental, formData } from '../interfaces/Pageable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  private url:string = "https://proyectoapi-rafmormor3.onrender.com";

  constructor(private http: HttpClient) { }

  //Hacemos la peticion para añadir el alquiler que le pasamos por parámetro.
  addRental(rental:Omit<Rental,"id">):Observable<Rental>{
    return this.http.post<Rental>(`${this.url}/rental`, rental);
  }

  //Hacemos la peticion para ver si las fechas son disponibles.
  available(form:formData):Observable<boolean>{
    return this.http.post<boolean>(`${this.url}/available`,form)
  }
}
