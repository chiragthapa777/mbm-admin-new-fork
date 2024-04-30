export interface TicketComment {
    id: number;
    stamp: Date;
    message: string;
    manager: Manager;
    ticket: Ticket;
}

export interface Manager {
    id: string;
    userLogin: string;
    userNicename: string;
    userEmail: string;
    userUrl: null;
    userRegistered: Date;
    userMsglastaccess: null;
    userLastaccess: null;
    userStatus: number;
    displayName: string;
    isAdmin: boolean;
    firstName: null;
    lastName: null;
    zipcode: null;
    phone: null;
    state: null;
    city: null;
    building: null;
    apartment: null;
    address: null;
    role: string;
    isActive: boolean;
}

export interface Ticket {
    id: number;
    stamp: Date;
    message: string;
    category: number;
    worktype: string;
    worktime: string;
    workprovider: string;
    workcost: string;
    finished: number;
    clientMessage: null;
    vendorMessage: null;
    providerEmail: null;
    adminEmail: null;
    adminNote: null;
    address: Address;
}

export interface Address {
    addressId: string;
    address: string;
    zipcode: string;
    city: string;
    statecode: string;
    statename: string;
}
