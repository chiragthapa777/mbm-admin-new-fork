import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaymentService } from './payment.service';
import { Payment, PaymentPagination } from './payment.types';

@Injectable({
    providedIn: 'root',
})
export class PaymentProductResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _paymentService: PaymentService,
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
    ): Observable<Payment> {
        return this._paymentService
            .getProductById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested product is not available
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
export class PaymentProductsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _paymentService: PaymentService) {}

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
    ): Observable<{ pagination: PaymentPagination; items: Payment[] }> {
        return this._paymentService.getProducts();
    }
}
