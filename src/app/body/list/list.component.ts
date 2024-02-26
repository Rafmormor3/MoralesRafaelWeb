import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Page } from '../../interfaces/Pageable';
import { VehicleService } from '../../services/vehicle.service';
import { SearchComponent } from '../search/search.component';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category, Vehicle } from '../../interfaces/Category';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent, RouterLink, RouterLinkActive],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{

  @Input() searchTerm:string=""; //recogemos el valor del buscador

  page!:Page;
  categories!:Category[];

  msg:boolean = false;

  //Propiedades de la pagina
  pageNumber:number=1;
  order:string="plateNumber";
  ad:string="asc";
  category:number=0;
  
  
  totalElements!:number;


  constructor(

    private vehicleService : VehicleService, 
    private categoryService:CategoryService,
    private loginService:LoginService

    ){}

  //función del botón para cuando no encontramos ningun vehiculo y podamos volver al catalogo 
  return(){
    this.searchTerm="";
    this.msg=false;
    this.getPage(1, this.order, this.ad, this.category);
  }


  //Obtenemos la pagina.
  getPage(page:number, order:string, ad:string, category:number){

    //Ruta para la peticion
    let link:string = `/vehicles?numPage=${page}&&order=${order}&&ad=${ad}&&category=${category}`;

    //Añadimos el modelo del vehiculo a la ruta si lo buscamos en el buscador.
    if(this.searchTerm!=undefined && this.category==0){
      link = `${link}&&model=${this.searchTerm}`
    }else{
      this.searchTerm="";
    }

    //console.log(link)
    this.pageNumber=page;
    this.ad = ad;

    //Hacemos la petición que nos devuelve una pagina.
    this.vehicleService.getCatalogo(link).subscribe({
      next: page=>{
        this.msg=false
        this.page=page;
        this.totalElements=page.totalElements;
      },
      error:(error)=>{
        console.log(error)
        this.msg = true
        console.log(this.msg)
      }
    })
  }

  //Al iniciar obtenemos la pagina 1 y cargamos en el select las categorias, para poder filtrar por ellas
  ngOnInit(): void {

    if(!this.pageNumber){
      this.pageNumber=1;
    }else if(!this.totalElements){
      this.totalElements=0;
    }

    this.getPage(this.pageNumber, this.order, this.ad, this.category);

    this.categoryService.getCategories().subscribe({
      next: categories => this.categories = categories
    })

  }
  
  //Pasaremos de pagina con esta funcion
  nextPage(page:number){
    return Number(page)+1;
  }

  //Funcion para los enlaces del paginado. Nos mostrara siempre los tres anteriores mayores de 0 , la pagina actual y 
  //los tres siguientes menores a la ultima pagina.
  getTotalPage(page:number){
    const array=[];

    for (let i = page - 1; i >= page - 3 && i > 0; i--) {
      array.unshift(i);
    }

    array.push(page);

    for (let i = page + 1; i <= page + 3 && i<this.page.totalPages; i++) {
      array.push(i);
    }

    return array;
  }

  //Hara la peticion de la pagina cuando en el componente hijo busquemos el modelo del coche.
  search(term:string){
    this.searchTerm=term;
    this.category=0;
    this.getPage(this.pageNumber, this.order, this.ad, this.category);

  }

  //Nos devuelve si es administrador o no
  admin():boolean{
    return this.loginService.idAdmin();
  }

  //Al pulsar en el icono de borrar, nos aparecera un sweetAlert que nos preguntara si queremos borrar o no.
  //En caso afirmativo se borrara.
  delete(id:number){
    Swal.fire({
      title: "¿Estás seguro de que quieres eliminar?",
      text: "Una vez aceptado será eliminado del catalogo.",
      icon: "warning",
      iconColor:"#d33",
      showCancelButton: true,
      confirmButtonColor: "#026f00",
      cancelButtonColor: "#710000",
      confirmButtonText: "Confirmar"
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehicleService.deleteVehicle(id).subscribe({
          next:(car)=>{
            
            Swal.fire({
              title: "¡Eliminado!",
              text: "El vehiculo ha sido eliminado con éxito.",
              icon: "success"
            }),

            this.getPage(1, this.order, this.ad, this.category);

          }
        })

      }
    });
  }

}

