import { PERMISSION_SUBJECT } from 'app/enums/permission.enum';

export interface User {
    id: string;
    displayName: string;
    userEmail: string;
    avatar?: string;
    status?: string;
    userLogin: string;
    userNicename: string;
    userUrl: null;
    userRegistered: Date;
    userMsglastaccess: null;
    userLastaccess: null;
    userStatus: number;
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
    permissions: Permission[];
}

export interface Permission {
    id: number;
    stamp: Date;
    userId: string;
    subject: PERMISSION_SUBJECT;
    ALL_ACTION: boolean;
    READ_ACTION: boolean;
    WRITE_ACTION: boolean;
    UPDATE_ACTION: boolean;
    DELETE_ACTION: boolean;
    DOWNLOAD_ACTION: boolean;
    EXPORT_ACTION: boolean;
    IMPORT_ACTION: boolean;
    UPLOAD_ACTION: boolean;
}
