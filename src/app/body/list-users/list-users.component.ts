import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit{

  listUsers!:User[];

  constructor(
    private userService:UserService,
    private router:Router
  ){}

  //Al iniciar recuperamos todos los usuarios de la base de datos.
  ngOnInit(): void {

    this.userService.getUsers().subscribe({
      next: users => this.listUsers = users
    })
    
  }

  //Funcion que nos redirige a la plantilla de edicion
  goTo(id:number){
    this.router.navigate(["editUser",id]);
  }

}
