import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataSharingService } from '../../services/data-sharing.service';
import { Content, Rental, formData } from '../../interfaces/Pageable';
import { Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { RentalService } from '../../services/rental.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-rental-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rental-form.component.html',
  styleUrl: './rental-form.component.css'
})
export class RentalFormComponent implements OnInit{

  constructor(
    private dataSharingService:DataSharingService,
    private vehicleService:VehicleService,
    private rentalService:RentalService,
    private route:Router,
    private loginService:LoginService
    ){}
  
  form:formData={
    idVehicle: 0,
    startDate: new Date(),
    endDate: new Date()
  }
  vehicle!:Content;

  rental:Omit<Rental,"id">={
    user:this.loginService.getIdUser(),
    vehicle:500,
    startDate: new Date(),
    endDate: new Date(),
    totalPrice:0
  }
  
  //Al iniciar cargamos los datos del servicio del formData donde hemos almacenado las fechas y el id del vehiculo.
  //Con tal id, buscamos el vehiculo para recoger mas datos.
  ngOnInit(): void {
    this.form =  this.dataSharingService.getFormData()
    console.log(this.form)
    this.vehicleService.getVehicle(this.form.idVehicle).subscribe({
      next: vehicle => this.vehicle=vehicle
    })
  }

  //Hacemos el calculo del precio total, devolviendo el precio total del alquiler.
  getTotalPrice():number{

    let start: number = new Date(this.form.startDate).getTime();
    let end: number = new Date(this.form.endDate).getTime();

    let days:number = (end - start)/ (1000*60*60*24);// convertimos los milisegundos en los dias que hay entre dos fechas.

    let res:number = 0;

    //Si hay 0 dias mostramos el precio de un dia
    if(days==0){
      res=this.vehicle.dailyPrice;
    
    //Asignamos al resultado los dias por el precio
    }else{
      res = days * this.vehicle.dailyPrice;
    }
    
    return parseFloat(res.toFixed(2));
  }

  //Devolvemos el formato dd/MM/yyyy de la fecha que introducimos
  formatDate(date:Date):string{
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }

  //Añadimos las propiedades necesarias al objeto Rental y loa añadimos a la base de datos.
  add(){
    this.rental.vehicle=this.vehicle.id;
    this.rental.startDate=this.form.startDate;
    this.rental.endDate=this.form.endDate;
    this.rental.totalPrice=this.getTotalPrice();

    //Añadimos y mandamos alerta de exito o de error.
    this.rentalService.addRental(this.rental).subscribe({
      next: (car)=> {
        Swal.fire({
          icon:'success',
          title:"Completado",
          text:"Reservado con éxito",
          confirmButtonColor:"#710000"

        }),
        this.route.navigate(["/vehicles"])
      },
      error:error=>{
        Swal.fire({
          icon:'error',
          title:"Error",
          text:error.error.message //mas descriptivas

        }),
        console.log(error),
        this.route.navigate(["/vehicles",this.form.idVehicle])
      }
    })
  }
  



}
