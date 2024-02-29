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

  ngOnInit(): void {

    this.userService.getUsers().subscribe({
      next: users => this.listUsers = users
    })
    
  }

  goTo(id:number){
    this.router.navigate(["editUser",id]);
  }

}
