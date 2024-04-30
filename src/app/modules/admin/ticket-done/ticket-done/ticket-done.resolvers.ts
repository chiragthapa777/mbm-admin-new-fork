import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TicketDoneService } from './ticket-done.service';
import { TicketDone, TicketDonePagination } from './ticket-done.types';

@Injectable({
    providedIn: 'root',
})
export class TicketDoneProductResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _paymentService: TicketDoneService,
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
    ): Observable<TicketDone> {
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
export class TicketDoneProductsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _paymentService: TicketDoneService) {}

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
    ): Observable<{ pagination: TicketDonePagination; items: TicketDone[] }> {
        return this._paymentService.getProducts();
    }
}
