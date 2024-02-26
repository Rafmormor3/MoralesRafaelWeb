import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../interfaces/User';
import { LoginComponent } from '../../body/login/login.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{

  user!:User

  constructor(
    private loginService:LoginService
  ){}

  isLogin():boolean{
    return this.loginService.isLogin()
  }

  isAdmin():boolean{
    return this.loginService.idAdmin();
  }

  logout(){
    this.loginService.logout();
  }

  username():string{;
    return this.loginService.getUser();
  }

}
