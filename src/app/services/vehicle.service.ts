import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Content, Page } from '../interfaces/Pageable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private url:string = "http://localhost:8082";

  constructor(private http : HttpClient) { }

  getCatalogo(link:string):Observable<Page>{
    return this.http.get<Page>(`${this.url}${link}`)
  }

  getVehicle(id:number):Observable<Content>{
    return this.http.get<Content>(`${this.url}/vehicles/${id}`)
  }

  deleteVehicle(id:number):Observable<Content>{
    return this.http.get<Content>(`${this.url}/deleteVehicle/${id}`)
  }

  postVehicle(vehicle:Omit<Content, "id"|"nameCategory"|"rentalList">):Observable<Content>{
    return this.http.post<Content>(`${this.url}/addVehicle`, vehicle);
  }

  editVehicle(vehicle:Omit<Content, "id"|"nameCategory"|"rentalList">, id:number):Observable<Content>{
    return this.http.put<Content>(`${this.url}/editVehicle/${id}`, vehicle);
  }
}
