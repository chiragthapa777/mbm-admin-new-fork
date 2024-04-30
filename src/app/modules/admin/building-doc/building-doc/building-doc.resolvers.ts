import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BuildingDocService } from './building-doc.service';
import { BuildingDoc, BuildingDocPagination } from './building-doc.types';



@Injectable({
    providedIn: 'root'
})
export class BuildingDocProductResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _paymentService: BuildingDocService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BuildingDoc>
    {
        return this._paymentService.getProductById(route.paramMap.get('id'))
                   .pipe(
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
    providedIn: 'root'
})
export class BuildingDocProductsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _paymentService: BuildingDocService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: BuildingDocPagination, items: BuildingDoc[] }>
    {
        return this._paymentService.getProducts();
    }
}


