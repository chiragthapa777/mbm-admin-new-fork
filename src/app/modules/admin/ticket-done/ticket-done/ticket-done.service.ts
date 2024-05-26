import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from 'app/services/user.auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { TicketDone, TicketDonePagination } from './ticket-done.types';

@Injectable({
    providedIn: 'root',
})
export class TicketDoneService {
    // Private
    private _pagination: BehaviorSubject<TicketDonePagination | null> =
        new BehaviorSubject(null);
    private _item: BehaviorSubject<TicketDone | null> = new BehaviorSubject(
        null
    );
    private _items: BehaviorSubject<TicketDone[] | null> = new BehaviorSubject(
        null
    );

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
    get pagination$(): Observable<TicketDonePagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<TicketDone> {
        return this._item.asObservable();
    }

    /**
     * Getter for items
     */
    get items$(): Observable<TicketDone[]> {
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
    ): Observable<{ pagination: TicketDonePagination; items: TicketDone[] }> {
        let url = environment.baseUrl + 'admin/tickets?finished=1';

        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/tickets?finished=1';
        }

        return this._httpClient
            .get<{ pagination: TicketDonePagination; items: any }>(url, {
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
                    let pagination: TicketDonePagination = {
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
    getProductById(id: string): any {
        return this._httpClient.get(environment.baseUrl + 'tickets/' + id);
        // .subscribe(
        //     // eslint-disable-next-line arrow-parens
        //     (res) => {
        //         console.log(
        //             '🚀 ~ file: ticket-done.service.ts:117 ~ TicketDoneService ~ getProductById ~ res:',
        //             res
        //         );
        //         return res;
        //     },
        //     (err) => {
        //         console.log(
        //             '🚀 ~ file: ticket-done.service.ts:124 ~ TicketDoneService ~ getProductById ~ err:',
        //             err
        //         );
        //         console.log(err);
        //     }
        // );

        // return this._items.pipe(
        //     take(1),
        //     map((items) => {
        //         // Find the item
        //         const item =
        //             items.find((payment) => payment.paymentId === id) || null;

        //         // Update the item
        //         this._item.next(item);

        //         // Return the item
        //         return item;
        //     }),
        //     switchMap((item) => {
        //         if (!item) {
        //             return throwError(
        //                 'Could not found item with id of ' + id + '!'
        //             );
        //         }

        //         return of(item);
        //     })
        // );
    }

    /**
     * Update item
     *
     * @param id
     * @param item
     */

    updateProduct(id: string, item: TicketDone) {
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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: {},
        };

        return this._httpClient
            .delete(environment.baseUrl + 'admin/payment/' + id, httpOptions)
            .subscribe(
                (res) => {
                    // return this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                    //     (items: any) => {}
                    // );
                },
                (err) => {
                    console.log(
                        '🚀 ~ file: ticket-done.service.ts:206 ~ TicketDoneService ~ deleteProduct ~ err:',
                        err
                    );
                }
            );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    addComment(item: any): any {
        console.log(
            '🚀 ~ file: ticket-done.service.ts:216 ~ TicketDoneService ~ addComment ~ item:',
            item
        );
        const httpOptions = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: item,
        };

        return this._httpClient
            .post(environment.baseUrl + 'admin/ticket-comments/', item)
            .subscribe(
                (res) =>
                    this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    ),
                (err) => {
                    console.log(
                        '🚀 ~ file: ticket-done.service.ts:234 ~ TicketDoneService ~ addComment ~ err:',
                        err
                    );
                }
            );
    }
}
