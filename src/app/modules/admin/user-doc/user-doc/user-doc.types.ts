export interface UserDocPagination
{
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

    export interface UserDoc {
        paymentId: string;
        description: string;
        amount: string;
        cardNum: number;
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





