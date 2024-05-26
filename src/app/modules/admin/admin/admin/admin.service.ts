import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    of,
    Subscription,
    throwError,
} from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Admin, AdminPagination } from './admin.types';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    // Private
    private _pagination: BehaviorSubject<AdminPagination | null> =
        new BehaviorSubject(null);
    private _item: BehaviorSubject<Admin | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Admin[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<AdminPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Admin> {
        return this._item.asObservable();
    }

    /**
     * Getter for items
     */
    get items$(): Observable<Admin[]> {
        return this._items.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get items
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getProducts(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: AdminPagination; items: Admin[] }> {
        return this._httpClient
            .get<{ pagination: AdminPagination; items: any }>(
                environment.baseUrl + 'users',
                {
                    params: {
                        page: '' + page,
                        limit: '' + size,
                        sortBy:
                            sort && order
                                ? `${sort}:${order?.toUpperCase()}`
                                : 'id:DESC',
                        // order,
                        search: 'Admin',
                        searchBy: 'role',
                    },
                }
            )
            .pipe(
                tap((response) => {
                    const pagination: AdminPagination = {
                        length: response['meta']['totalItems'],
                        size: response['meta']['itemsPerPage'],
                        page: response['meta']['currentPage'],
                        lastPage: response['meta']['totalPages'],
                        startIndex: 1,
                        endIndex: response['meta']['totalPages'],
                    };

                    this._pagination.next(pagination);
                    this._items.next(response['data']);
                })
            );
    }

    /**
     * Get item by id
     */
    getProductById(id: string): Observable<Admin> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find the item
                const item = items.find((admin) => admin.id === id) || null;

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
            }),
            switchMap((item) => {
                if (!item) {
                    return throwError(
                        'Could not found item with id of ' + id + '!'
                    );
                }

                return of(item);
            })
        );
    }

    /**
     * Create item
     */

    createProduct(admin) {
        return this._httpClient
            .post(environment.baseUrl + 'admin', admin)
            .subscribe(
                (res) => {
                    return this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    );
                },
                (err) => {}
            );
    }

    /**
     * Update item
     *
     * @param id
     * @param item
     */

    updateProduct(id: string, item: Admin): Subscription {
        return this._httpClient
            .patch(environment.baseUrl + 'users/' + id, item)
            .subscribe(
                (res) => {
                    return this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    );
                },
                (err) => {}
            );
    }

    /**
     * Delete the item
     *
     * @param id
     */
    deleteProduct(id: string) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: {},
        };

        return this._httpClient
            .delete(environment.baseUrl + 'users/' + id, httpOptions)
            .subscribe(
                (res) => {
                    return this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    );
                },
                (err) => {}
            );
    }
}
