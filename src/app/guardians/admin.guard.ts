import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const adminGuard: CanActivateFn = (route, state) => {

  const loginService = inject(LoginService)
  const router = inject(Router)

  const admin = loginService.idAdmin()

  if(loginService.isLogin() && admin==false){
    Swal.fire({
      title: "Acceso Denegado",
      text: "Usted no es administrador.",
      icon: "error",
      confirmButtonColor:"#710000"
    });
    return router.navigate(["home"])
  }else if(!loginService.isLogin()){
    return router.navigate(["login"])
  }

  return admin;


};
