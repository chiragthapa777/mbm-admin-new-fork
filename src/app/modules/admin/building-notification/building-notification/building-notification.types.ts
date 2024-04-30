export interface BuildingNotificationPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface User {
    id: string;
    userLogin: string;
    userNicename: string;
    userEmail: string;
    userUrl: string;
    userRegistered: Date;
    userMsglastaccess?: Date;
    userLastaccess?: Date;
    userStatus: number;
    displayName: string;
    isAdmin: boolean;
}

export interface BuildingNotification {
    id: number;
    stamp: string;
    message: string;
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
