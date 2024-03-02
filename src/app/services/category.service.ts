import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url:string = "http://localhost:8082";

  constructor(private http: HttpClient) { }

  //Obtenemos todas las categorias
  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(`${this.url}/categories`);
  }

  //Obtenemos la categoria con tal id
  getCategory(idCategory:number):Observable<Category>{
    return this.http.get<Category>(`${this.url}/category/${idCategory}`)
  }
}
