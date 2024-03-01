import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Content, formData } from '../../interfaces/Pageable';
import { VehicleService } from '../../services/vehicle.service';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataSharingService } from '../../services/data-sharing.service';
import { ValidateDateService } from '../../validators/validate-date.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{

  @Input() id : number = 0; //rescatamos el id de la ruta

  vehicle!:Content;

  //Formulario que asignamos las fechas. Sus datos se mandaran mediante un servicio a los detalles del alquiler.
  formData:formData={
    idVehicle: 0,
    startDate: new Date(),
    endDate: new Date()
  };

  body:string="bodyNot";

  //Los inputs del formulario hecho con sweetAlert
  startInput !: HTMLInputElement
  endInput !: HTMLInputElement

  
  constructor(
    private vehicleService : VehicleService,
    private router:Router,
    private dataSharingService:DataSharingService,
    private validateDateService:ValidateDateService,
    private loginService : LoginService
    ){}
  
  //Al iniciar, rescatamos el vehiculo con tal id para mostrar los detalles.
  ngOnInit(): void {
      
    this.vehicleService.getVehicle(this.id).subscribe({
      next: vehicle => this.vehicle=vehicle
    })
    
  }

  //Funcion con la que sabremos si el usuario esta logueado o no
  login():boolean{
    
    if(this.loginService.isLogin()){
      this.body="body"
      return true;
    }

    return false;
    
  }

  //Formulario donde introduciremos las fechas. 
  form(){
    Swal.fire({
      title:"Fecha de Reserva",
      html:`
      <style>
        div{
          color:#710000;
        }

        #startDate, #endDate{
          border-radius:5px;
          width:30%;
          padding-left:5px;
          marging-left:5px;
        }

        @media only screen and (max-width: 768px) {
          #startDate, #endDate{
            border-radius:5px;
            width:45%;
            padding-left:5px;
            marging-left:5px;
          }
        }
      </style>
      <div>
        <label>Fecha de Inicio: </label>
        <input type="date" id="startDate"><br><br>
        <label>Fecha de Final: </label>
        <input type="date" id="endDate"><br>
      </div>
      `,
      confirmButtonText: 'Seguir',
      confirmButtonColor:"#710000",
      focusConfirm: false,

      //Cuando se abra inicializamos los inputs
      didOpen: () => {
        const popup = Swal.getPopup()!
        this.startInput = popup.querySelector('#startDate') as HTMLInputElement
        this.endInput= popup.querySelector('#endDate') as HTMLInputElement
      },

      //Antes de confirmar asignamos los valores del formulario al formData
      preConfirm: () => {
        this.formData.idVehicle=this.id;
        this.formData.startDate= new Date(this.startInput.value);
        this.formData.endDate=new Date(this.endInput.value) ;

        this.goTo();
      },

    })
  }

  //
  goTo(){
    //console.log(this.formData)

    //Validamos que haya fechas
    if(!this.validateDateService.isValidDate(this.formData.startDate) 
      || !this.validateDateService.isValidDate(this.formData.endDate)){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Fechas invalidas, asegurate de poner alguna fecha.",
          confirmButtonColor:"#710000"
        });

    //Validamos que las fechas sean validas
    }else if(!this.validateDateService.endAfter(this.formData.startDate, this.formData.endDate)){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La fecha de inicio debe ser posterior a la actual y anterior a la final.",
        confirmButtonColor:"#710000"
      });

    //Si las fechas y el formulario esta bien, nos redirige a la ficha de alquiler.
    }else{
      
      this.dataSharingService.setFormData(this.formData)
      this.router.navigate(["rentalForm"])
    }

  }

}
