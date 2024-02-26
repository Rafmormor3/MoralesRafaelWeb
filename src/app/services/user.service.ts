import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url : string = "http://localhost:8082/register";

  constructor(private http:HttpClient) { }

  register(user:Omit<User, "id"|"role"|"active"|"rentalList">){
    return this.http.post<User>(this.url, user);
  }

  getUser(id:number){
    return this.http.get<User>(`http://localhost:8082/user/${id}`)
  }

}
