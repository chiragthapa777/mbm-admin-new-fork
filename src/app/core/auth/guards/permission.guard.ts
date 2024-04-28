import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserAuthService } from 'app/services/user.auth.service';

export const PermissionGuard: CanActivateFn | CanActivateChildFn = async (
    route,
    state
) => {
    const router: Router = inject(Router);
    const userAuthService: UserAuthService = inject(UserAuthService);
    const authService: AuthService = inject(AuthService);

    const data = route.data;
    // return true;
    if (userAuthService.getUser() === null) {
        await userAuthService.loadUser();
    }
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    if (userAuthService.isAuthorized()) {
        if (data?.permission && userAuthService.isManager()) {
            if (userAuthService.hasHasEnoughPermission(data.permission)) {
                return true;
            } else {
                router.navigate(['no-permission'], {
                    queryParams: { redirectUrl },
                });
                return false;
            }
        } else {
            return true;
        }
    }
    authService.signOut();
    router.navigate(['sign-in'], {
        queryParams: { redirectUrl },
    });
    return false;
};
