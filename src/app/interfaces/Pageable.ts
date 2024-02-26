export interface Page {
    content:          Content[];
    pageable:         Pageable;
    totalPages:       number;
    totalElements:    number;
    last:             boolean;
    sort:             Sort;
    first:            boolean;
    size:             number;
    number:           number;
    numberOfElements: number;
    empty:            boolean;
}

export interface Content {
    id:           number;
    plateNumber:  string;
    brand:        string;
    model:        string;
    image:        string;
    year:         number;
    color:        string;
    fuel:         string;
    category:     number;
    nameCategory: string;
    dailyPrice:   number;
    rentalList:   null;
}

export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    paged:      boolean;
    unpaged:    boolean;
}

export interface Sort {
    unsorted: boolean;
    sorted:   boolean;
    empty:    boolean;
}

export interface formData{
    idVehicle: number;
    startDate: Date;
    endDate: Date
}

export interface Rental {
    id:         number;
    user:       number;
    vehicle:    number;
    startDate:  Date;
    endDate:    Date;
    totalPrice: number;
}