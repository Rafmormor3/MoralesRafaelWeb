import { HttpInterceptorFn } from '@angular/common/http';

//Con el interceptor le añadimos la cabecera Authorization y el valor el token del usuario.

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem("token")

  if(!req.url.includes("cloudinary")){
    if(token){
      req = req.clone({
        setHeaders:{Authorization:token}
      })
      //console.log("Token: ",token)
    }
  }

  return next(req);
};
