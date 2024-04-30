export interface Pagination<T> {
    data: T[];
    meta: PaginationMeta;
}
export interface PaginationMeta {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy?: Array<string[]>;
}
