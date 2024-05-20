import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDocService } from './user-doc.service';
import { UserDoc, UserDocPagination } from './user-doc.types';



@Injectable({
    providedIn: 'root'
})
export class UserDocProductResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _paymentService: UserDocService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserDoc>
    {
        return this._paymentService.getProductById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested item is not available
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
    providedIn: 'root'
})
export class UserDocProductsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _paymentService: UserDocService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: UserDocPagination, items: UserDoc[] }>
    {
        return this._paymentService.getProducts();
    }
}


