import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';

//Con el interceptor le añadimos la cabecera Authorization y el valor el token del usuario.

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const loader = inject(NgxUiLoaderService)
  loader.start();

  const token = localStorage.getItem("token")

  if(!req.url.includes("cloudinary")){
    if(token){
      req = req.clone({
        setHeaders:{Authorization:token}
      })
      console.log("Token: ",token)
    }
  }

  return next(req).pipe(
    finalize(()=>loader.stop())
  );
};
