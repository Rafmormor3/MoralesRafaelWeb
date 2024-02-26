import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private fb:FormBuilder,
    private loginService:LoginService,
    private router:Router
  ){}

  @ViewChild("myForm") myForm!:NgForm

  loginForm(){
    if(this.myForm.valid){
      const {username, password} = this.myForm.value
      this.loginService.login(username, password)
      .subscribe(
        resp => {
          if (resp===true){
            this.router.navigateByUrl('/')
          }
          else{
            Swal.fire({
              title: 'Error!',
              text: "Usuario o contraseña incorrectas",
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor:"#710000"
            })
          }
        }
      )
    }
  }

}
