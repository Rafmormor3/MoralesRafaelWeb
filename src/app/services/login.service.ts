import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse, User } from '../interfaces/User';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = "http://localhost:8082/signin";

  private user!:User;

  constructor(
    private http:HttpClient,
    private router : Router
  ) { }

  storageUser(resp:LoginResponse){
    localStorage.setItem("token", resp.token)
    // console.log(jwtDecode(resp.token))
    this.user = resp.user
  }

  login(username: string, password: string): Observable<Boolean | string> {
    return this.http.post<LoginResponse>(`${this.baseUrl}`, { username, password })
      .pipe(
        tap(resp => {
          this.storageUser(resp);
        }),
        map(resp => true),
        catchError(err => of(err.error.msg))
      )
  }

  logout(){
    localStorage.removeItem("token")
    this.router.navigate([""])
  }

  isLogin():boolean{
    let token =localStorage.getItem("token")? jwtDecode(localStorage.getItem("token") as string) : null;

    return token!=null? true : false;
  }

  getUser():string{
    let token:any =localStorage.getItem("token")? jwtDecode(localStorage.getItem("token") as string) : "";
    return token.sub;
    
  }

  getIdUser():number{
    let token:any =localStorage.getItem("token")? jwtDecode(localStorage.getItem("token") as string) : "";
    return token.id;
  }

  idAdmin():boolean{
    let rol =localStorage.getItem("token")? (jwtDecode(localStorage.getItem("token") as string) as any).role : "";
    return rol=="ROLE_ADMIN"? true : false;

  }


}
