import { Content } from "./Pageable";


export interface User {
    id:         number;
    name:       string;
    email:      string;
    phone:      string;
    address:    string;
    username:   string;
    password:   string;
    role:       Role;
    active:     number;
    rentalList: Rental[];
}

export interface Rental {
    id:         number;
    user:       number;
    vehicle:    number | Content; //El vehiculo sera o de tipo numero o de tipo Content=Vehiculo
    startDate:  number;
    endDate:    number;
    totalPrice: number;
}

export enum Role {
    User = "user",
}

export interface LoginResponse{
    user:User,
    token:string
}