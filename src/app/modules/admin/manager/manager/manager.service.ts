import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Manager, ManagerPagination } from './manager.types';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ManagerService {
    // Private
    private _pagination: BehaviorSubject<ManagerPagination | null> =
        new BehaviorSubject(null);
    private _item: BehaviorSubject<Manager | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Manager[] | null> = new BehaviorSubject(
        null
    );

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
    get pagination$(): Observable<ManagerPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Manager> {
        return this._item.asObservable();
    }

    /**
     * Getter for items
     */
    get items$(): Observable<Manager[]> {
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
    ): Observable<{ pagination: ManagerPagination; items: Manager[] }> {
        return this._httpClient
            .get<{ pagination: ManagerPagination; items: any }>(
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
                        search: 'Manager',
                    },
                }
            )
            .pipe(
                tap((response) => {
                    let pagination: ManagerPagination = {
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
    getProductById(id: string): Observable<Manager> {
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
            .post(environment.baseUrl + 'users', admin)
            .subscribe(
                (res) => {
                    return this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    );
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    /**
     * Update item
     *
     * @param id
     * @param item
     */

    updateProduct(id: string, item: Manager) {
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
        console.log(environment.baseUrl + id);

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
