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

export enum PERMISSION_SUBJECT {
    ADMIN = 'ADMIN',
    PAYMENT_LOG = 'PAYMENT_LOG',
    BUILDING = 'BUILDING',
    USER = 'USER',
    MANAGER = 'MANAGER',
    TICKET = 'TICKET',
    TICKET_COMMENT = 'TICKET_COMMENT',
    BUILDING_DOC = 'BUILDING_DOC',
    USER_DOC = 'USER_DOC',
    NOTIFICATION = 'NOTIFICATION',
    PAYMENT = 'PAYMENT',
    MAIL = 'MAIL',
}
export const PermissionSubjectArray: (PERMISSION_SUBJECT | string)[] =
    Object.keys(PERMISSION_SUBJECT).map((key) => PERMISSION_SUBJECT[key]);

export const PermissionSubjectArrayDisplay: {
    name: PERMISSION_SUBJECT | string;
    displayName: string;
}[] = Object.keys(PERMISSION_SUBJECT).map((key) => ({
    name: PERMISSION_SUBJECT[key],
    displayName: PERMISSION_SUBJECT[key]
        .replace('_', ' ')
        .replace('DOC', 'Document')
        .toLowerCase(),
}));

export enum PERMISSION_ACTION {
    ALL = 'ALL_ACTION',
    READ = 'READ_ACTION',
    WRITE = 'WRITE_ACTION',
    UPDATE = 'UPDATE_ACTION',
    DELETE = 'DELETE_ACTION',
    DOWNLOAD = 'DOWNLOAD_ACTION',
    UPLOAD = 'UPLOAD_ACTION',
    EXPORT = 'EXPORT_ACTION',
    IMPORT = 'IMPORT_ACTION',
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
