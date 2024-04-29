import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ManagerService } from './manager.service';
import { Manager, ManagerPagination } from './manager.types';

@Injectable({
    providedIn: 'root',
})
export class ManagerProductResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _adminService: ManagerService,
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
    ): Observable<Manager> {
        return this._adminService.getProductById(route.paramMap.get('id')).pipe(
            // Error here means the requested product is not available
            catchError((error) => {
                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

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
export class ManagerProductsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _adminService: ManagerService) {}

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
    ): Observable<{ pagination: ManagerPagination; items: Manager[] }> {
        return this._adminService.getProducts();
    }
}
