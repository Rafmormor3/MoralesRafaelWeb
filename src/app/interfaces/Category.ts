export interface Category {
    id:       number;
    name:     Name;
    vehicles: Vehicle[];
}

export enum Name {
    Compact = "Compact",
    Convertible = "Convertible",
    Coupe = "Coupe",
    Crossover = "Crossover",
    Economy = "Economy",
    Electric = "Electric",
    FullSize = "Full-size",
    Hatchback = "Hatchback",
    Hybrid = "Hybrid",
    Luxury = "Luxury",
    Midsize = "Midsize",
    Minivan = "Minivan",
    PickupTruck = "Pickup Truck",
    Sedan = "Sedan",
    SportsCar = "Sports Car",
    Suv = "SUV",
    The4X4 = "4x4",
    Truck = "Truck",
    Van = "Van",
    Wagon = "Wagon",
}

export interface Vehicle {
    id:           number;
    plateNumber:  string;
    brand:        string;
    model:        string;
    image:        string;
    year:         number;
    color:        Color;
    fuel:         Fuel;
    category:     number;
    nameCategory: Name;
    dailyPrice:   number;
    rentalList:   null;
}

export enum Color {
    Aquamarine = "Aquamarine",
    Blue = "Blue",
    Crimson = "Crimson",
    Fuscia = "Fuscia",
    Goldenrod = "Goldenrod",
    Green = "Green",
    Indigo = "Indigo",
    Khaki = "Khaki",
    Maroon = "Maroon",
    Mauv = "Mauv",
    Orange = "Orange",
    Pink = "Pink",
    Puce = "Puce",
    Purple = "Purple",
    Red = "Red",
    Teal = "Teal",
    Turquoise = "Turquoise",
    Violet = "Violet",
    Yellow = "Yellow",
}

export enum Fuel {
    Diesel = "diesel",
    Gasoline = "gasoline",
}