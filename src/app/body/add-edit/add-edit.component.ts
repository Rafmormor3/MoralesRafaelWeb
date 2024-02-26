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

  @Input() id! : number; //id que recuperamos si vamos a editar

  image : string = ""; //Enlace de la imagen que recogemos del formulario
  categories!:Category[];

  //Objeto que añadiremos
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

  //Campos del formulario con sus respectivas validaciones.
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

  //Tratamos el mensaje de error segun los errores del campo matricula
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

  //Tratamos los mensajes de error segun los errores del campo categoria
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

  //Al iniciar, si la id no es nula, entonces rellena los campos del formulario con los del vehiculo con tal id
  ngOnInit(): void {

    if(this.id!=null){

      this.vehicleService.getVehicle(this.id).subscribe({
        next: response =>{
          console.log(response)

          this.image = response.image || ''; //Tratamos la imagen

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

    //Recogemos las categorias para rellenar el select del formulario
    this.categoryService.getCategories().subscribe({
      next: categories => this.categories = categories
    })
  }

  //Funcion de añadir o editar
  add(){

    //Añadir
    if (this.myForm.valid && this.id==null) {

      //Subimos la imagen y añadimos a la base de datos.
      this.uploadService.uploadFile(this.image).subscribe({
        //le asignamos al campo imagen la url que nos manda cloudinary al subirlo.
        next: (response:any) => {
          const imageUrl = response.secure_url;
          this.image = imageUrl;
          const {...vehicle} = this.myForm.value;
          this.vehicle = vehicle;
          this.vehicle.image = imageUrl; 

          //Una vez asiganada la imagen, añadimos a la base de datos y mandamos mensaje de exito o de error.
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

          this.myForm.reset(); //Una vez añadido reiniciamos el formulario
        },
        //Mensaje de error al subir la imagen.
        error: (err) => {
          Swal.fire({
            title: "Opps...!",
            text: "Error al subir la imagen.",
            icon: "error",
          });
        }
      });

    //Editar
    }else if(this.myForm.valid && this.id!=null){

      //Subimos la nueva imagen y asignamos la url que nos mandan al campo imagen
      this.uploadService.uploadFile(this.image).subscribe({
        next: (response:any) => {
          const imageUrl = response.secure_url;
          this.image = imageUrl;
          const {...vehicle} = this.myForm.value;
          this.vehicle = vehicle;
          this.vehicle.image = imageUrl; 

          //Realizamos la edicion y mostramos mensaje de exito o de error
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

    //Si no esta bien el formulario, mensaje de error.
    }else{
      Swal.fire({
        title: "Opps...!",
        text: "Asegurese de que los campos sean correctos.",
        icon: "error",
      });
    }
  }

  //Lee el fichero que le asignamos al campo imagen. Carga y nos muestra la imagen seleccionada.
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
