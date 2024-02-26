import { Routes } from '@angular/router';
import { ListComponent } from './body/list/list.component';
import { DetailsComponent } from './body/details/details.component';
import { LoginComponent } from './body/login/login.component';
import { HomeComponent } from './body/home/home.component';
import { RentalFormComponent } from './body/rental-form/rental-form.component';
import { jwtGuard } from './guardians/jwt.guard';
import { RegisterComponent } from './body/register/register.component';
import { HistorialComponent } from './body/historial/historial.component';
import { AddEditComponent } from './body/add-edit/add-edit.component';
import { adminGuard } from './guardians/admin.guard';

export const routes: Routes = [
    {path:"", component:HomeComponent},
    {path:"home", component:HomeComponent},
    {path:"vehicles", component:ListComponent},
    {path:"vehicles/:id", component:DetailsComponent},
    {path:"rentalForm", component:RentalFormComponent, canMatch:[jwtGuard]},
    {path:"login", component:LoginComponent},
    {path:"register", component:RegisterComponent},
    {path:"historial",component:HistorialComponent, canMatch:[jwtGuard]},
    {path:"addEdit", component:AddEditComponent, canMatch:[adminGuard]},
    {path:"addEdit/:id", component:AddEditComponent, canMatch:[adminGuard]}

];
