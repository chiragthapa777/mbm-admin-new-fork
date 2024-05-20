import { ROLE_ENUM } from 'app/enums/role.enum';

export interface UserPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface User {
    id: string;
    parent: string;
    name: string;
    slug: string;
    icon: string;
    cover: string;
    description: string;
    role: ROLE_ENUM;
}
