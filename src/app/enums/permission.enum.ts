/* eslint-disable @typescript-eslint/naming-convention */
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
