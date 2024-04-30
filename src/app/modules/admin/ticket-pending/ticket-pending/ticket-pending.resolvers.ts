import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TicketPendingService } from './ticket-pending.service';
import { TicketPending, TicketPendingPagination } from './ticket-pending.types';

@Injectable({
    providedIn: 'root',
})
export class TicketPendingProductResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _paymentService: TicketPendingService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<TicketPending> {
        return this._paymentService
            .getProductById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested item is not available
                catchError((error) => {
                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url
                        .split('/')
                        .slice(0, -1)
                        .join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

@Injectable({
    providedIn: 'root',
})
export class TicketPendingProductsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _paymentService: TicketPendingService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<{
        pagination: TicketPendingPagination;
        items: TicketPending[];
    }> {
        return this._paymentService.getProducts();
    }
}
