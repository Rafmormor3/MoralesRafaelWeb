import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

//Guardian que controla si es administrados o no
export const adminGuard: CanMatchFn = (route, state) => {

  //Inyectamos servicios
  const loginService = inject(LoginService)
  const router = inject(Router)

  //Llamamos a la funcion que nos dice si el usuario es administrador o no
  const admin = loginService.idAdmin()

  //Si esta logueado pero no es admin , nos salta un mensaje y nos lleva al home.
  if(loginService.isLogin() && admin==false){
    Swal.fire({
      title: "Acceso Denegado",
      text: "Usted no es administrador.",
      icon: "error",
      confirmButtonColor:"#710000"
    });
    return router.navigate(["home"])

  //Si no esta logueado nos lleva a la pagina de login
  }else if(!loginService.isLogin()){
    return router.navigate(["login"])
  }

  return admin;


};
