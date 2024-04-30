export interface BuildingDocPagination {
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
    icon: string;
    userRegistered: Date;
    userMsglastaccess?: Date;
    userLastaccess?: Date;
    userStatus: number;
    displayName: string;
    isAdmin: boolean;
}

export interface BuildingDoc {
    paymentId: string;
    description: string;
    amount: string;
    cardNum: number;
    icon: number;
    expDate: string;
    echeckAba: string;
    echeckAccount: string;
    echeckBankname: string;
    echeckBankacctname: string;
    echeckAccttype: string;
    echeckEchecktype: string;
    transactionId: string;
    transactionStatus: string;
    transactionDate: Date;
    user: User;
}
