import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { User, UserPagination } from './user.types';
import { UserAuthService } from 'app/services/user.auth.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    // Private
    private _pagination: BehaviorSubject<UserPagination | null> =
        new BehaviorSubject(null);
    private _item: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<User[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private userAuthService: UserAuthService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<UserPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<User> {
        return this._item.asObservable();
    }

    /**
     * Getter for items
     */
    get items$(): Observable<User[]> {
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
    ): Observable<{ pagination: UserPagination; items: User[] }> {
        let url = environment.baseUrl + 'users';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/users';
        }

        return this._httpClient
            .get<{ pagination: UserPagination; items: any }>(url, {
                params: {
                    page: '' + page,
                    limit: '' + size,
                    sortBy:
                        sort && order
                            ? `${sort}:${order?.toUpperCase()}`
                            : 'id:DESC',
                    search: 'User',
                },
            })
            .pipe(
                tap((response) => {
                    let pagination: UserPagination = {
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
    getProductById(id: string): Observable<User> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find the item
                const item = items.find((user) => user.id === id) || null;

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

    createProduct(user) {
        return this._httpClient
            .post(environment.baseUrl + 'user', user)
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
    /**
     * Update item
     *
     * @param id
     * @param item
     */

    updateProduct(id: string, item: User) {
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
        // console.log(environment.baseUrl + 'item');

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
