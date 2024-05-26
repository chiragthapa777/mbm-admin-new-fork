import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { TicketPendingPagination, TicketPending } from './ticket-pending.types';
import { UserAuthService } from 'app/services/user.auth.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TicketPendingService {
    // Private
    private _pagination: BehaviorSubject<TicketPendingPagination | null> =
        new BehaviorSubject(null);
    private _item: BehaviorSubject<TicketPending | null> = new BehaviorSubject(
        null
    );
    private _items: BehaviorSubject<TicketPending[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private readonly userAuthService: UserAuthService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<TicketPendingPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<TicketPending> {
        return this._item.asObservable();
    }

    /**
     * Getter for items
     */
    get items$(): Observable<TicketPending[]> {
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
        page: number = 1,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: TicketPendingPagination;
        items: TicketPending[];
    }> {
        let url = environment.baseUrl + 'admin/tickets?finished=0';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/tickets?finished=0';
        }
        return this._httpClient
            .get<{ pagination: TicketPendingPagination; items: any }>(url, {
                params: {
                    page: '' + page,
                    limit: '' + size,
                    sortBy:
                        sort && order
                            ? `${sort}:${order?.toUpperCase()}`
                            : 'id:DESC',
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    let pagination: TicketPendingPagination = {
                        length: response['meta']['totalItems'],
                        size: response['meta']['itemsPerPage'],
                        page: response['meta']['currentPage'],
                        lastPage: response['meta']['totalPages'],
                        startIndex: 0,
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
    getProductById(id: string): Observable<TicketPending> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find the item
                const item =
                    items.find((payment) => payment.id === Number(id)) || null;

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
     * Update item
     *
     * @param id
     * @param item
     */

    updateProduct(id: string, item: TicketPending) {
        // console.log(environment.baseUrl + 'item');

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: item,
        };

        return this._httpClient
            .patch(environment.baseUrl + 'payment/' + id, item)
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
    deleteById(id: number) {
        // console.log(environment.baseUrl + 'item');

        let url = environment.baseUrl + 'admin/tickets/' + id;
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/tickets/' + id;
        }

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: {},
        };

        return this._httpClient.delete(url, httpOptions).subscribe({
            next: (res) => {
                return this.getProducts(1, 10, 'name', 'asc', '');
            },
            error: (err) => {},
        });
    }
}
