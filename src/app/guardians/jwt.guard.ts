import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';


//Guardian que nos devuelve true si esta logueado y si es false nos lleva al login.
export const jwtGuard: CanMatchFn = (route, segments) => {

  //Inyectamos servicios
  const loginService = inject(LoginService)
  const router = inject(Router)

  //Llamamos a la funcion que nos dice si esta logueado o no.
  const login = loginService.isLogin()

  return login? login : router.navigate(["login"]);

};
