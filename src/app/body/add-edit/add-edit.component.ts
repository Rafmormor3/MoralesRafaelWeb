import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Content } from '../../interfaces/Pageable';
import { CategoryService } from '../../services/category.service';
import { Category, Vehicle } from '../../interfaces/Category';
import { UploadService } from '../../services/upload.service';
import { VehicleService } from '../../services/vehicle.service';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css'
})
export class AddEditComponent implements OnInit{

  @Input() id! : number;

  image : string = "";
  categories!:Category[];

  vehicle : Omit<Content, "id"|"nameCategory"|"rentalList"> = {
    plateNumber:  "",
    brand:        "",
    model:        "",
    image:        "",
    year:         0,
    color:        "",
    fuel:         "",
    category:     0,
    dailyPrice:   0

  }

  constructor(
    private fb :FormBuilder,
    private categoryService:CategoryService,
    private uploadService:UploadService,
    private vehicleService:VehicleService
  ){}

  myForm:FormGroup = this.fb.group({
    plateNumber:  ["", [Validators.required, Validators.pattern("[A-Z0-9]*")],[]],
    brand:        ["", [Validators.required]],
    model:        ["", [Validators.required]],
    image:        [""],
    year:         [1953, [Validators.required, Validators.min(1953), Validators.max(2020)]],
    color:        ["", [Validators.required]],
    fuel:         ["",[Validators.required]],
    category:     [0,[Validators.required, Validators.min(1)]],
    dailyPrice:   [0,[Validators.required, Validators.min(1)]]
  })

  invalidField(field:string){
    return this.myForm.get(field)?.invalid 
            && this.myForm.get(field)?.touched;
  }

  get plateNumberError():string{
    const errors = this.myForm.get('plateNumber')?.errors ;
    let errorMsg: string = '';
    if(errors){
      if( errors['required']){
        errorMsg = 'La matricula es obligatoria';
      }
      else if(errors['pattern']){
        errorMsg = 'La matricula solo puede contener numeros y letras mayusculas.';
      }
    }
    return errorMsg;
  }

  get categoryError():string{
    const errors = this.myForm.get('category')?.errors ;
    let errorMsg: string = '';
    if(errors){
      if( errors['required']){
        errorMsg = 'La categoria es obligatoria';
      }
      else if(errors['min']){
        errorMsg = 'Elija una categoria.';
      }
    }
    return errorMsg;
  }

  ngOnInit(): void {

    if(this.id!=null){

      this.vehicleService.getVehicle(this.id).subscribe({
        next: response =>{
          console.log(response)

          this.image = response.image || '';

          this.myForm.setValue({
            plateNumber: response.plateNumber,
            brand: response.brand,
            model: response.model,
            image:"",
            year: response.year,
            color: response.color,
            fuel: response.fuel,
            category: response.category,
            dailyPrice: response.dailyPrice
          });

        } 
      })


    }



    this.categoryService.getCategories().subscribe({
      next: categories => this.categories = categories
    })
  }

  add(){
    if (this.myForm.valid && this.id==null) {
      this.uploadService.uploadFile(this.image).subscribe({
        next: (response:any) => {
          const imageUrl = response.secure_url;
          this.image = imageUrl;
          const {...vehicle} = this.myForm.value;
          this.vehicle = vehicle;
          this.vehicle.image = imageUrl; 
          this.vehicleService.postVehicle(this.vehicle).subscribe({
            next: (data) => {
              Swal.fire({
                title: "Éxito!",
                text: "Vehiculo añadido!",
                icon: "success",
                denyButtonColor:"#710000"
              })
            },
            error: (err) => {
              Swal.fire({
                title: "Error",
                text: err.error.message,
                icon: "error",
              });
            }
          });
          this.myForm.reset();
        },
        error: (err) => {
          Swal.fire({
            title: "Opps...!",
            text: "Error al subir la imagen.",
            icon: "error",
          });
        }
      });
    }else if(this.myForm.valid && this.id!=null){
      this.uploadService.uploadFile(this.image).subscribe({
        next: (response:any) => {
          const imageUrl = response.secure_url;
          this.image = imageUrl;
          const {...vehicle} = this.myForm.value;
          this.vehicle = vehicle;
          this.vehicle.image = imageUrl; 
          this.vehicleService.editVehicle(this.vehicle, this.id).subscribe({
            next: (data) => {
              Swal.fire({
                title: "Éxito!",
                text: "Vehiculo editado!",
                icon: "success",
              })
            },
            error: (err) => {
              Swal.fire({
                title: "Error",
                text: "Error en la edición",
                icon: "error",
              });
            }
          });
          this.myForm.reset();
        },
        error: (err) => {
          Swal.fire({
            title: "Opps...!",
            text: "Error!!" + err.message,
            icon: "error",
          });
        }
      });
    }else{
      Swal.fire({
        title: "Opps...!",
        text: "Asegurese de que los campos sean correctos.",
        icon: "error",
      });
    }
  }

  getFile(event: Event) {

    const input: HTMLInputElement = <HTMLInputElement>event.target;

    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('Got here: ', typeof(e.target.result));
        this.image = e.target.result;
      }
      reader.readAsDataURL(input.files[0]);
    }

  }


}
