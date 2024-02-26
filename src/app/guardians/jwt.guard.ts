import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const jwtGuard: CanMatchFn = (route, segments) => {

  const loginService = inject(LoginService)
  const router = inject(Router)

  const login = loginService.isLogin()

  return login? login : router.navigate(["login"]);

};
