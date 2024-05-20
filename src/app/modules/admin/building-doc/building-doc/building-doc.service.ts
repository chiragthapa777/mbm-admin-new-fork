import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from 'app/services/user.auth.service';
import {
    BehaviorSubject,
    Observable,
    of,
    throwError
} from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { BuildingDoc, BuildingDocPagination } from './building-doc.types';

@Injectable({
    providedIn: 'root',
})
export class BuildingDocService {
    // Private
    private _pagination: BehaviorSubject<BuildingDocPagination | null> =
        new BehaviorSubject(null);
    private _item: BehaviorSubject<BuildingDoc | null> = new BehaviorSubject(
        null
    );
    private _items: BehaviorSubject<BuildingDoc[] | null> = new BehaviorSubject(
        null
    );

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
    get pagination$(): Observable<BuildingDocPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<BuildingDoc> {
        return this._item.asObservable();
    }

    /**
     * Getter for items
     */
    get items$(): Observable<BuildingDoc[]> {
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
    ): Observable<{ pagination: BuildingDocPagination; items: BuildingDoc[] }> {
        let url = environment.baseUrl + 'admin/documents?type=building';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/documents/building-docs';
        }

        return this._httpClient
            .get<{ pagination: BuildingDocPagination; items: any }>(url, {
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
                    const pagination: BuildingDocPagination = {
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
    getProductById(id: string): Observable<BuildingDoc> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find the item
                const item =
                    items.find((payment) => payment.paymentId === id) || null;

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

    updateProduct(id: string, item: BuildingDoc) {
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
    deleteProduct(id: string, type) {
        // console.log(environment.baseUrl + 'item');

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: {},
        };

        return this._httpClient
            .delete(
                environment.baseUrl + 'admin/documents/' + id + '?type=' + type,
                httpOptions
            )
            .subscribe(
                (res) => {
                    return this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    );
                },
                (err) => {}
            );
    }

    addDocs(formData: FormData): Observable<any> {
        let url = environment.baseUrl + 'admin/documents?type=building';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/documents/building';
        }
        return this._httpClient
            .post(url, formData)
            .pipe(tap(() => this.getProducts().subscribe((items: any) => {})));
    }
}
