import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import {
    BuildingNotification,
    BuildingNotificationPagination,
} from './building-notification.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAuthService } from 'app/services/user.auth.service';
import { environment } from '../../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class BuildingNotificationService {
    // Private
    private _pagination: BehaviorSubject<BuildingNotificationPagination | null> =
        new BehaviorSubject(null);
    private _item: BehaviorSubject<BuildingNotification | null> =
        new BehaviorSubject(null);
    private _items: BehaviorSubject<BuildingNotification[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private readonly userAuthService: UserAuthService,
        private _snackBar: MatSnackBar
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<BuildingNotificationPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<BuildingNotification> {
        return this._item.asObservable();
    }

    /**
     * Getter for items
     */
    get items$(): Observable<BuildingNotification[]> {
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
    ): Observable<{
        pagination: BuildingNotificationPagination;
        items: BuildingNotification[];
    }> {
        let url = environment.baseUrl + 'admin/notifications';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/notifications';
        }
        return this._httpClient
            .get<{ pagination: BuildingNotificationPagination; items: any }>(
                url,
                {
                    params: {
                        page: '' + page,
                        limit: '' + size,
                        sortBy:
                            sort && order
                                ? `${sort}:${order?.toUpperCase()}`
                                : 'id:DESC',
                        search,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    let paginatio: BuildingNotificationPagination = {
                        length: response['meta']['totalItems'],
                        size: response['meta']['itemsPerPage'],
                        page: response['meta']['currentPage'],
                        lastPage: response['meta']['totalPages'],
                        startIndex: 1,
                        endIndex: response['meta']['totalPages'],
                    };

                    this._pagination.next(paginatio);
                    this._items.next(response['data']);
                })
            );
    }

    /**
     * Get item by id
     */
    getProductById(id: number): Observable<BuildingNotification> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find the item
                const item = items.find((payment) => payment.id === id) || null;

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

    addNotification(body: any): Observable<any> {
        let url = environment.baseUrl + 'admin/notifications';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/notifications';
        }

        return this._httpClient
            .post(url, body)
            .pipe(
                tap(() =>
                    this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    )
                )
            );
    }

    updateNotification(id: number, body: any): Observable<any> {
        let url = environment.baseUrl + `admin/notifications/${id}`;
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + `manager/notifications/${id}`;
        }

        return this._httpClient
            .patch(url, body)
            .pipe(
                tap(() =>
                    this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    )
                )
            );
    }

    deleteNotification(id: number): Observable<any> {
        let url = environment.baseUrl + 'admin/notifications/' + id?.toString();
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/notifications/' + id?.toString;
        }

        return this._httpClient
            .delete(url)
            .pipe(
                tap(() =>
                    this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    )
                )
            );
    }

    /**
     * Update item
     *
     * @param id
     * @param item
     */

    updateProduct(id: string, item: BuildingNotification) {
        // console.log(environment.baseUrl + 'item');

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: item,
        };

        return this._httpClient
            .patch(environment.baseUrl + 'admin/payment/' + id, item)
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
            .delete(environment.baseUrl + 'admin/payment/' + id, httpOptions)
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
