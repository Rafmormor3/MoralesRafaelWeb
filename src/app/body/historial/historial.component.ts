import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Rental, User } from '../../interfaces/User';
import { LoginService } from '../../services/login.service';
import { VehicleService } from '../../services/vehicle.service';
import { Content } from '../../interfaces/Pageable';
import { Observable, concat, from, map, switchMap, toArray } from 'rxjs';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit{

  rentals!:Rental[];
  plateNumber:string="";
  
  constructor(
    private userService:UserService,
    private loginService:LoginService,
    private vehicleService:VehicleService
  ){}

  ngOnInit(): void {

    this.userService.getUser(this.loginService.getIdUser()).subscribe({

      next: (user) =>{

        //Estamos almacenando los Observables que estamos generando al cambiar el alquiler.
        const rentalObservables = user.rentalList.map(
          rental=> this.vehicleService.getVehicle(rental.vehicle as number).pipe(
              //Con map estamos combinando la copia de el alquiler con el objeto vehiculo que obtenemos del getVehicle.
              //Cambiando el vehiculo de tipo number al objeto vehiculo
              map(vehicle=>({...rental, vehicle})) 
            )
          )

          //concat coge cada observable y lo ejecuta uno detras de otro.
          //Tras ejecutarlos todos, lo convierte en array, con el pipe que trata los observables.

          concat(...rentalObservables).pipe(
              toArray()
            ).subscribe(//manejamos el array que hemos convertido en el pipe.
              (rentalVehicles) => {
                  this.rentals = rentalVehicles; // asignamos el nuevo array donde cada rental tiene el objeto vehiculo al antiguo array
              }
          )

        
      } 
    })
  }

  //Le decimos al rental.vehicle que coja el tipo Content=Vehicle
  public toVehicle(vehicle:any):Content{
    return vehicle as Content;
  }
  

}
