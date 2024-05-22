import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserAuthService } from './user.auth.service';
import { Permission } from 'app/core/user/user.types';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    constructor(
        private _httpClient: HttpClient,
        private userAuthService: UserAuthService
    ) {}

    getPermissions(query: { userId: number }): Observable<Permission[]> {
        if (!this.userAuthService.isAdmin()) {
            return;
        }
        return this._httpClient.get<Permission[]>(
            environment.baseUrl + 'permissions',
            {
                params: query,
            }
        );
    }
    addPermissions(body: any): Observable<Permission[]> {
        if (!this.userAuthService.isAdmin()) {
            return;
        }
        return this._httpClient.post<Permission[]>(
            environment.baseUrl + 'permissions',

            body
        );
    }

    updatePermissionBulk(permissions: any): Observable<any> {
        if (!this.userAuthService.isAdmin()) {
            return;
        }
        return this._httpClient.patch<any>(
            environment.baseUrl + 'permissions/bulk',
            { permissions }
        );
    }
}
