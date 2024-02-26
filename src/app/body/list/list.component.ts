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

  @Input() searchTerm:string="";

  page!:Page;
  categories!:Category[];

  msg:boolean = false;

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


  return(){
    this.searchTerm="";
    this.msg=false;
    this.getPage(1, this.order, this.ad, this.category);
  }

  getPage(page:number, order:string, ad:string, category:number){

    let link:string = `/vehicles?numPage=${page}&&order=${order}&&ad=${ad}&&category=${category}`;

    if(this.searchTerm!=undefined && this.category==0){
      link = `${link}&&model=${this.searchTerm}`
    }else{
      this.searchTerm="";
    }

    //console.log(link)
    this.pageNumber=page;
    this.ad = ad;
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
  

  nextPage(page:number){
    return Number(page)+1;
  }

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

  search(term:string){
    this.searchTerm=term;
    this.category=0;
    this.getPage(this.pageNumber, this.order, this.ad, this.category);

  }

  admin():boolean{
    return this.loginService.idAdmin();
  }

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

