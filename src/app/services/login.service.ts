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

  private baseUrl = "http://localhost:8082";

  private user!:User;

  constructor(
    private http:HttpClient,
    private router : Router
  ) { }

  //Añadimos al LocalStorage el token del usuario logueado.
  storageUser(resp:LoginResponse){
    localStorage.setItem("token", resp.token)
    // console.log(jwtDecode(resp.token))
    this.user = resp.user
  }

  //Hacemos la peticion de loguearse. Añadimos el token con la funcion anterior y devolvemos true si todo ha ido bien.
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

  //Borramos el token del localStorage y mandamos al usuario al home.
  logout(){
    localStorage.removeItem("token")
    this.router.navigate([""])
  }

  // Comprobamos si hay token o no, con lo que estaria registrado o no
  isLogin():boolean{
    let token =localStorage.getItem("token")? jwtDecode(localStorage.getItem("token") as string) : null;

    return token!=null? true : false;
  }

  //Decodificamos el token y devolvemos el username del usuario registrado.
  getUser():string{
    let token:any =localStorage.getItem("token")? jwtDecode(localStorage.getItem("token") as string) : "";
    return token.sub;
    
  }

  //Decodificamos el token y nos devuelve el id del usuario registrado.
  getIdUser():number{
    let token:any =localStorage.getItem("token")? jwtDecode(localStorage.getItem("token") as string) : "";
    return token.id;
  }

  //Decodificamos el token y nos devuelve si el usuario es administrador o no.
  idAdmin():boolean{
    let rol =localStorage.getItem("token")? (jwtDecode(localStorage.getItem("token") as string) as any).role : "";
    return rol=="ROLE_ADMIN"? true : false;

  }


}
