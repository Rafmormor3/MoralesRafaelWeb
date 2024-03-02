import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Content, Page } from '../interfaces/Pageable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private url:string = "https://proyectoapi-rafmormor3.onrender.com";

  constructor(private http : HttpClient) { }

  //Hacemos la petición para obtener la pagina.
  getCatalogo(link:string):Observable<Page>{
    return this.http.get<Page>(`${this.url}${link}`)
  }

  //Hacemos la peticion para obtener el vehiculo con tal id
  getVehicle(id:number):Observable<Content>{
    return this.http.get<Content>(`${this.url}/vehicles/${id}`)
  }

  //Hacemos la peticion para eliminar el vehiculo con tal id.
  deleteVehicle(id:number):Observable<Content>{
    return this.http.get<Content>(`${this.url}/deleteVehicle/${id}`)
  }

  //Hacemos la peticion para añadir el vehiculo que pasamos por parametro.
  postVehicle(vehicle:Omit<Content, "id"|"nameCategory"|"rentalList">):Observable<Content>{
    return this.http.post<Content>(`${this.url}/addVehicle`, vehicle);
  }

  //Hacemos la peticion para editar el vehiculo con tal id.
  editVehicle(vehicle:Omit<Content, "id"|"nameCategory"|"rentalList">, id:number):Observable<Content>{
    return this.http.put<Content>(`${this.url}/editVehicle/${id}`, vehicle);
  }
}
