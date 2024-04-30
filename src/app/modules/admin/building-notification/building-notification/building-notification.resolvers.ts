import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BuildingNotificationService } from './building-notification.service';
import {
    BuildingNotification,
    BuildingNotificationPagination,
} from './building-notification.types';

@Injectable({
    providedIn: 'root',
})
export class BuildingNotificationProductResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _paymentService: BuildingNotificationService,
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
    ): Observable<BuildingNotification> {
        return this._paymentService
            .getProductById(Number(route.paramMap.get('id')))
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
export class BuildingNotificationProductsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _paymentService: BuildingNotificationService) {}

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
        pagination: BuildingNotificationPagination;
        items: BuildingNotification[];
    }> {
        return this._paymentService.getProducts();
    }
}
