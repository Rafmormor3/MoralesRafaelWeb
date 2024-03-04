import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidateEmailService } from '../../validators/validate-email.service';
import { ValidateUsernameService } from '../../validators/validate-username.service';
import { RouterLink } from '@angular/router';
import { User } from '../../interfaces/User';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit{

  @Input() id!:number; //id del usuario que queremos editar

  user!:Omit<User, "id" | "password" | "role" | "active" | "rentalList">;

  constructor(
    private userService:UserService,
    private fb : FormBuilder

  ){}

  //Al iniciar la pagina nos cargar los datos del usuario con el id de la ruta.
  ngOnInit(): void {
    
    this.userService.getUser(this.id).subscribe({
      next: user => {
        this.user = user;
        this.myForm.setValue({
          name : user.name,
          email : user.email,
          phone: user.phone,
          address: user.address,
          username: user.username
        });
      }
    })

  }

   //Formulario con las validaciones de los campos.
   myForm:FormGroup = this.fb.group({
    name:["", [Validators.required]],
    email:["",[Validators.required, Validators.email]],
    phone:["",[Validators.required,Validators.pattern("[0-9]*"), Validators.minLength(9), Validators.maxLength(10)]],
    address:["",[Validators.required]],
    username:["",[Validators.required]]
  },{})

  //Validacion formulario
  invalidField(field:string){
    return this.myForm.get(field)?.invalid 
            && this.myForm.get(field)?.touched;
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

  //Funcion donde llamaremos al servicio para editar el usuario.
  //Si se ha editado correctamente mostrará mensaje de exito.
  //Si hay error, nos mostrará un mensaje de error.
  submit(){
    this.user = this.myForm.value;
    this.userService.editUser(this.id, this.user).subscribe({
      next: (user)=>{
        Swal.fire({
          title: "Éxito!",
          text: "Usuario editado!",
          icon: "success",
        })
      },
      error: (error)=>{
        Swal.fire({
          title: "Error",
          text: error.error.message,
          icon: "error",
        });
      }
    })
  }
}
