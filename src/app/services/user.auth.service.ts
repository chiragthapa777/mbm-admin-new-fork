import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import {
    PERMISSION_ACTION,
    PERMISSION_SUBJECT,
} from 'app/enums/permission.enum';
import { ROLE_ENUM } from 'app/enums/role.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PermissionMetaType {
    subject: PERMISSION_SUBJECT;
    actions: PERMISSION_ACTION[];
}

@Injectable({
    providedIn: 'root',
})
export class UserAuthService {
    private user$: BehaviorSubject<User | null> =
        new BehaviorSubject<User | null>(null);
    constructor(private _httpClient: HttpClient) {
        console.log('constructor UserAuthService');
    }

    getUser(): User {
        return this.user$.value;
    }

    isManager(): boolean {
        if (this.getUser()?.role && this.getUser().role === ROLE_ENUM.MANAGER) {
            return true;
        }
        return false;
    }

    isAdmin(): boolean {
        if (this.getUser()?.role && this.getUser().role === ROLE_ENUM.ADMIN) {
            return true;
        }
        return false;
    }

    setUser(user: User): void {
        this.user$.next(user);
    }

    getUser$(): Observable<User> {
        return this.user$;
    }

    async loadUser(): Promise<void> {
        const user = await this._httpClient
            .get<any>(environment.baseUrl + 'users/me')
            .toPromise();
        this.setUser(user);
    }

    isAuthorized(): boolean {
        return this.getUser()?.id ? true : false;
    }

    hasHasEnoughPermission(routePermissions: PermissionMetaType[]): boolean {
        try {
            const userPermissions = this.getUser()?.permissions;

            if (!userPermissions) {
                return false;
            }
            if (this.isAdmin()) {
                return true;
            }
            for (const routePermission of routePermissions) {
                const matchingUserPermission = userPermissions.find(
                    (userPermission) =>
                        userPermission.subject === routePermission?.subject &&
                        (routePermission.actions.every(
                            (action) => userPermission[action]
                        ) ||
                            userPermission[PERMISSION_ACTION.ALL])
                );

                if (!matchingUserPermission) {
                    return false;
                }
            }
            return true;
        } catch (error) {
            return false;
        }
    }
}
