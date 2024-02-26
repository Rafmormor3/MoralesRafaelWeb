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
  
  ngOnInit(): void {
    this.form =  this.dataSharingService.getFormData()
    console.log(this.form)
    this.vehicleService.getVehicle(this.form.idVehicle).subscribe({
      next: vehicle => this.vehicle=vehicle
    })
  }

  getTotalPrice():number{

    let start: number = new Date(this.form.startDate).getTime();
    let end: number = new Date(this.form.endDate).getTime();

    let days:number = (end - start)/ (1000*60*60*24);

    let res:number = 0;

    if(days==0){
      res=this.vehicle.dailyPrice;
    }else{
      res = days * this.vehicle.dailyPrice;
    }
    
    return res;
  }

  formatDate(date:Date):string{
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }

  add(){
    this.rental.vehicle=this.vehicle.id;
    this.rental.startDate=this.form.startDate;
    this.rental.endDate=this.form.endDate;
    this.rental.totalPrice=this.getTotalPrice();

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
