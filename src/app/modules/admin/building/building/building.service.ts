import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Building, BuildingPagination } from './building.types';
import { UserAuthService } from 'app/services/user.auth.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class BuildingService {
    // Private
    private _pagination: BehaviorSubject<BuildingPagination | null> =
        new BehaviorSubject(null);
    private _item: BehaviorSubject<Building | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Building[] | null> = new BehaviorSubject(
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
    get pagination$(): Observable<BuildingPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Building> {
        return this._item.asObservable();
    }

    /**
     * Getter for items
     */
    get items$(): Observable<Building[]> {
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
    ): Observable<{ pagination: BuildingPagination; items: Building[] }> {
        let url = environment.baseUrl + 'admin/buildings';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/buildings';
        }

        url +=
            '?searchBy=address&searchBy=zipcode&searchBy=city&searchBy=statename';

        return this._httpClient
            .get<{ pagination: BuildingPagination; items: any }>(url, {
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
                    const pagination: BuildingPagination = {
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
    getProductById(id: string): Observable<Building> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find the item
                const item =
                    items.find((building) => building.addressId === id) || null;

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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    createProduct(building: any) {
        return this._httpClient
            .post(environment.baseUrl + 'admin/buildings', building)
            .subscribe(
                (res) =>
                    this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    ),
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    updateProduct(id: string, item: Building) {
        return this._httpClient
            .patch(environment.baseUrl + 'admin/buildings/' + id, item)
            .subscribe(
                (res) =>
                    this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    ),
                (err) => {}
            );
    }

    getBuildingOptions(): Observable<any> {
        // console.log(environment.baseUrl + 'item');

        const httpOptions = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        return this._httpClient.get(
            environment.baseUrl + 'admin/buildings/options'
        );
    }

    /**
     * Delete the item
     *
     * @param id
     */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    deleteProduct(id: string) {
        return this._httpClient
            .delete(environment.baseUrl + 'admin/buildings/' + id)
            .subscribe(
                (res) =>
                    this.getProducts(1, 10, 'name', 'asc', '').subscribe(
                        (items: any) => {}
                    ),
                (err) => {}
            );
    }
}
