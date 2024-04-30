export interface TicketPending {
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
    user: User;
    address: Address;
}
interface Address {
    addressId: string;
    address: string;
    zipcode: string;
    city: string;
    statecode: string;
    statename: string;
}

interface User {
    id: string;
    userLogin: string;
    userNicename: string;
    userEmail: string;
    userUrl: string;
    userRegistered: Date;
    userMsglastaccess: Date;
    userLastaccess: Date;
    userStatus: number;
    displayName: string;
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    zipcode: string;
    phone: string;
    state: string;
    city: string;
    building: string;
    apartment: string;
    address: null;
    role: string;
    isActive: boolean;
}
export interface TicketPendingPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}