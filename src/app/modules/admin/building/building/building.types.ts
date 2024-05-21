export interface BuildingPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface Building {
    addressId: string;
    address: string;
    zipcode: string;
    city: string;
    statecode: string;
    statename: string;
    documents: Document[];
}

export interface Document {
    id: number;
    description: string;
    extension: string;
    filename: string;
    documentUrl: string;
}
