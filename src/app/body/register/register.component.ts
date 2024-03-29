import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ValidateEmailService } from '../../validators/validate-email.service';
import { ValidateUserService } from '../../validators/validate-user.service';
import { ValidateUsernameService } from '../../validators/validate-username.service';
import { User } from '../../interfaces/User';
import { JsonPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { PasswordService } from '../../validators/password.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,JsonPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  user!:Omit<User, "id"|"role"|"active"|"rentalList">;

  constructor(
    private fb:FormBuilder,
    private validateEmailService:ValidateEmailService,
    private validateUserService:ValidateUserService,
    private validateUsernameService:ValidateUsernameService,
    private passwordService:PasswordService,
    private userService : UserService,
    private router:Router
  ){}

  //Formulario con las validaciones de los campos.
  myForm:FormGroup = this.fb.group({
    name:["", [Validators.required]],
    email:["",[Validators.required, Validators.email],[this.validateEmailService]],
    phone:["",[Validators.required,Validators.pattern("[0-9]*"), Validators.minLength(9), Validators.maxLength(10)]],
    address:["",[Validators.required]],
    username:["",[Validators.required],[this.validateUsernameService]],
    password:["",[Validators.required, this.passwordService.createPasswordStrengthValidator()]],
    passwordRep:["",[Validators.required]]
  },{validators:[this.validateUserService.passwords("password","passwordRep")]})

  invalidField(field:string){
    return this.myForm.get(field)?.invalid 
            && this.myForm.get(field)?.touched;
  }

  //Manejo de los mensajes de error del email
  get errorPassword(): string {
    const errors = this.myForm.get('password')?.errors ;
    let errorMsg: string = '';
    if(errors){
      if( errors['required']){
        errorMsg = 'La contraseña es obligatoria';
      }
      else if(errors['passwordStrength']){
        errorMsg = 'La contraseña debe tener una mayuscula, una minuscula y un numero.';
      }
      
    }
    return errorMsg;
  }

  //Manejo de los mensajes de error del username
  get usernameErrorMsg(): string {
    const errors = this.myForm.get('username')?.errors ;
    let errorMsg: string = '';
    if(errors){
      if( errors['required']){
        errorMsg = 'El nombre de usuario es obligatorio';
      }
      else if(errors['usernameTaken']){
        errorMsg = 'El el nombre de usuario ya esta en uso';
      }
      
    }
    return errorMsg;
  }

  //Manejo de los mensajes de error del email
  get emailErrorMsg(): string {
    const errors = this.myForm.get('email')?.errors ;
    let errorMsg: string = '';
    if(errors){
      if( errors['required']){
        errorMsg = 'El email es obligatorio';
      }
      else if(errors['email']){
        errorMsg = 'El email no tiene formato de correo';
      }
      else if(errors['emailTaken']){
        errorMsg = 'El email ya está en uso'
      }
      
    }
    return errorMsg;
  }

  //Manejo de los mensajes de error del campo telefono
  get phoneErrors():string{
    const errors = this.myForm.get('phone')?.errors ;
    let errorMsg: string = '';
    if(errors){
      if( errors['required']){
        errorMsg = 'El telefono es obligatorio';
      }
      else if(errors['pattern']){
        errorMsg = 'El telefono esta compuesto por solo numeros';
      }
      else if(errors['minlength']){
        errorMsg = 'El numero de telefono tiene que tener entre 9 y 10 digitos'
      }
      else if(errors['maxlength']){
        errorMsg = 'El numero de telefono tiene que tener entre 9 y 10 digitos'
      }
      
    }
    return errorMsg;
  }

  //Funcion de registro. Si se registra o si da fallo nos lleva al login.
  submit(){
    
    this.myForm.markAllAsTouched();
    if(this.myForm.valid){
      const {passwordRep, ...user} = this.myForm.value; //quitamos el passwordRep y le añadimosa user todos los datos de myForm
      this.user=user;

      this.userService.register(this.user).subscribe({
        next: (user)=> {
          Swal.fire({
            icon:'success',
            title:"Completado",
            text:"Registrado con éxito.",
            confirmButtonColor:"#710000"
  
          }),
          this.router.navigate(["/login"])
        },
        error:error=>{
          Swal.fire({
            icon:'error',
            title:"Error",
            text:error.error.message
  
          }),
          console.log(error),
          this.router.navigate(["/login"])
        }
      }
        
      )

    }
  }
  

}
